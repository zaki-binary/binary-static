package BinaryStatic::Controller::Page;

use Mojo::Base 'Mojolicious::Controller';

sub toolkit {
    my $c = shift;

    my %file_map = (
        '/c/contact.cgi' => 'misc/contact_us'
    );

    $c->render(
        template => 'misc/contact_us',
        handler => 'tt'
    );
}

sub haml {
    my $c = shift;

    my %file_map = (
        '/' => 'home/index'
    );

    $c->render(
        template => 'home/index',
        handler => 'haml',
        layout   => $self->layout('full_width'),
    );
}

1;