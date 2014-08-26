[% IF is_legacy || !longcode.defined %]
        [% l("Legacy Contract") %]
[% ELSE %]
        [% longcode | replace('\s+:\s+', ': ') %]
        <br/>
        [% IF runbet_ticks.defined %]
                [% l('Ticks') %]:
                [% last_tick = runbet_ticks.pop %]
                <strong>[%- runbet_ticks.shift -%]</strong>, 
                [%- runbet_ticks.join(', ') -%],
                <strong>[%- last_tick -%]</strong>
        [% ELSE %]
                [% analyse_link %]
        [% END %]
[% END %]
