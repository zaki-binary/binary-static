package BinaryStatic;

use Mojo::Base 'Mojolicious';

sub startup {
    my $self = shift;

    $self->plugin(charset => {charset => 'utf-8'});
    $self->plugin('DefaultHelpers');
    $self->plugin('TagHelpers');
    $self->plugin('BinaryStatic::Helpers');

    # fix paths
    unshift @{$self->renderer->paths}, $self->home->rel_dir('../src/templates/toolkit');
    unshift @{$self->renderer->paths}, $self->home->rel_dir('../src/templates/haml');
    unshift @{$self->static->paths}, $self->home->rel_dir('../src');

    $self->plugin('haml_renderer', { cache => 0 });
    $self->plugin('tt_renderer' => {
        template_options => {}
    });
    $self->renderer->default_handler( 'haml' );
    # $self->defaults(layout => 'default');

    # translation
    $self->plugin('I18N', { default => 'en' });
    $self->hook(before_dispatch => sub {
        my $c = shift;

        if (my $lang = $c->req->param('l')) {
            $c->languages(lc $lang);
        }
    });

    $self->renderer->add_helper(countries_options => sub {
        return (
            { code => 'af', name => 'Afghanistan' }
        );
    });

    # Router
    my $r = $self->routes;

    $r->any('/')->to('page#haml');

    $r->any('/c/contact.cgi')->to('page#toolkit');
}

1;
