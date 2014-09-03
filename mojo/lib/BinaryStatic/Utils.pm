package BinaryStatic::Utils;

use strict;
use warnings;
use base 'Exporter';
use vars qw/@EXPORT_OK/;
@EXPORT_OK = qw/today_yyyymmdd/;

sub today_yyyymmdd {
    my @d = localtime();
    return sprintf('%04d-%02d-%02d', $d[5]+1900, $d[4]+1, $d[3]);
}

1;