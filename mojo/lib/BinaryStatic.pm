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
    $r->get('/timestamp')->to('page#timestamp');
    $r->get('/country')->to('page#country');
    $r->get('/why-us')->to('page#haml');
    $r->get('/partnerapi')->to('page#haml');
    $r->get('/devguide')->to('page#haml');

    # Routing for this rather than adding the file to public/ as everything
    # in public/ will be served by our CDN. We want this served by Mojo.
    $r->get('/robots.txt')->to('page#robots_txt');

    $r->get('/tour')->to('page#haml');
    $r->get('/responsible-trading')->to('page#haml');
    $r->get('/careers')->to('page#haml');
    $r->get('/group-history')->to('page#haml');
    $r->get('/smart-indices')->to('page#haml');
    $r->get('/open-source-projects')->to('page#haml');
    $r->get('/resources')->to('page#haml');
    $r->get('/charting')->to('page#haml');
    $r->get('/about-us')->to('page#haml');

    $r->any('/c/contact.cgi')->to('page#toolkit');

    $r->route('/exception')->to('page#exception');
    $r->route('/*')->to('page#not_found');
}

1;
