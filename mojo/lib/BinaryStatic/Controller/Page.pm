package BinaryStatic::Controller::Page;

use Mojo::Base 'Mojolicious::Controller';
use BinaryStatic::Consts;

sub toolkit {
    my $c = shift;

    my %url_map = (
        '/c/contact.cgi' => 'misc/contact_us'
    );

    $c->render(
        template => 'misc/contact_us',
        handler => 'tt'
    );
}

sub haml {
    my $c = shift;

    my $curr_path = $c->req->url->path->to_string;
    $curr_path =~ s/^\/|\/$//g;

    # template, layout, code
    my %url_map = (
        '' => ['home/index', 'full_width'],
        'home' => ['home/index', 'full_width'],
        'ticker' => ['home/ticker', ''],

        'why-us' => ['static/why_us', 'full_width'],
        'partnerapi' => ['static/devguide', 'full_width'],
        'devguide' => ['static/partner_api', 'full_width'],
        'tour' => ['static/tour', 'full_width'],
        'responsible-trading' => ['static/responsible_trading', 'full_width'],

        'not_found' => ['not_found', '', 404],
        'exception' => ['exception', 'exception', 500]
    );
    my $m = $url_map{$curr_path} || $url_map{'not_found'};

    ## page vars
    my @extra_stash;
    if ($curr_path eq 'ticker') {
        push @extra_stash, (rows => [ BinaryStatic::Consts::ticker() ]);
    }

    $c->render(
        template => $m->[0],
        handler => 'haml',
        defined $m->[1] ? (layout => $m->[1] ? $c->layout($m->[1]) : '') : (),
        $m->[2] ? (status => $m->[2]) : (),
        @extra_stash
    );
}

sub timestamp {
    my $self = shift;
    return $self->render(json => {timestamp => time});
}

sub country {
    my $self = shift;
    return $self->render(
        json => {
            country => 'cn',
            ip      => '60.180.68.53'
        },
        status => 200,
    );
}

sub robots_txt {
    my $self = shift;
    return $self->render(
        data   => "User-agent: *\nDisallow",
        format => 'txt',
    );
}

sub open_account_with_promocode {
    my $self           = shift;
    my $promo_code     = $self->param('promo');
    my $affilate_token = $self->param('t');
    return $self->redirect_to(
        'linkto_acopening.cgi',
        {
            actype          => 'real',
            promotionalcode => $promo_code,
            t               => $affilate_token
        });
}

sub not_found {
    my $self = shift;
    return $self->render(
        template => 'not_found',
        status   => 404,
    );
}

sub exception {
    my $self = shift;
    return $self->render(
        template => 'exception',
        layout   => 'exception',
        status   => 500,
    );
}

1;