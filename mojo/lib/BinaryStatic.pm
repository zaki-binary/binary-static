package BinaryStatic;

use Mojo::Base 'Mojolicious';

sub startup {
    my $self = shift;

    $self->plugin(charset => {charset => 'utf-8'});
    $self->plugin('DefaultHelpers');
    $self->plugin('TagHelpers');
    $self->plugin('BinaryStatic::Helpers');

    # fix paths
    $self->renderer->paths([
        $self->home->rel_dir('../src/templates/haml'),
        $self->home->rel_dir('../src/templates/toolkit')
    ]);
    $self->static->paths([
        $self->home->rel_dir('../src')
    ]);

    $self->plugin('haml_renderer', { cache => 0 });
    $self->plugin('tt_renderer' => {
        template_options => {}
    });
    $self->renderer->default_handler( 'haml' );
    $self->defaults(layout => 'default');

    # translation
    $self->plugin('I18N', { default => 'en' });
    $self->hook(before_dispatch => sub {
        my $c = shift;

        ## language
        if (my $lang = $c->req->param('l')) {
            $c->languages(lc $lang); # I18N
            $c->session(__lang => lc $lang);
        }
        $c->stash(language => uc($c->session('__lang') || 'en'));
    });

    # Router
    my $r = $self->routes;

    $r->get('/')->to('page#haml');
    $r->get('/home')->to('page#haml');
    $r->get('/promo/:promo')->to('page#open_account_with_promocode');
    $r->get('/ticker')->to('page#haml');
    # $r->get('/helloworld')->to('home#helloworld');
    # $r->get('/timestamp')->to('home#timestamp');
    # $r->get('/country')->to('home#country');
    # $r->get('/why-us')->to('static#why_us')->name('why-us');
    # $r->get('/partnerapi')->to('static#partner_api')->name('partnerapi');
    # $r->get('/devguide')->to('static#devguide')->name('devguide');

    $r->any('/c/contact.cgi')->to('page#toolkit');

    $r->route('/exception')->to('page#exception');
    $r->route('/*')->to('page#not_found');
}

1;
