#!/usr/bin/env plackup
use Plack::Builder;

$ENV{MOJO_MODE} = 'debug';

my $app = sub {
    my $env = shift;
    use FindBin qw/$Bin/;
    use lib "$Bin/mojo/lib";
    use BinaryStatic;
    BinaryStatic->new->start($env);
};

builder {
    enable 'Debug', panels => [ qw(Environment Parameters Response Timer Memory) ]
        if $ENV{DEBUG_BINARYSTATIC};
    $app->();
};