<p>Data for the following random markets is available for download:
<ul>
[% FOR symbol IN symbols %]
<li><a href="[% request.url_for('tick-data-downloads.cgi', {underlying => symbol.value, ts => timestamp}) %]">[% symbol.label FILTER html %]</a>
[% END %]
</ul>
