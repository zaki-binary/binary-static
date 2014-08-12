var tt_chart;

function updateTTChart(config) {
    if (tt_chart) {
        TickTrade.reset();
        tt_chart.chart.destroy();
        tt_chart = null;
    }
    config.trade_visualization = true;
    tt_chart = new LiveChartTick(config);
    tt_chart.show_chart();
}

var TickTrade = function() {
    return {
        client_prediction: function() {
            return $('#tick-prediction').data('prediction');
        },
        how_many_ticks: function() {
            return tt_chart.config.how_many_ticks;
        },
        process: function(current_tick) {
            var $self = this;

            if (!$self.entry_spot && tt_chart.config.with_entry_spot) {
                $self.set_entry_spot();
            }

            if (current_tick) {
                if (tt_chart.config.with_tick_config) {
                    var tick_prediction = $self.client_prediction();
                    var win_pallet = 'rgba(46,136,54,0.1)';
                    var lose_pallet = 'rgba(204,0,0,0.05)';
                    var what_color;

                    if (tick_prediction === 'up') {
                        what_color = current_tick > $self.entry_spot ? win_pallet: lose_pallet;
                    } else if (tick_prediction === 'down') {
                        what_color = current_tick < $self.entry_spot ? win_pallet: lose_pallet;
                    }
                    tt_chart.chart.chartBackground.css({color: what_color});
                }
            }

            if ($self.how_many_ticks() && ticks_array.length == $self.how_many_ticks()) {
                $self.process_tick_trade();
                $self.reset();
            }
        },
        set_entry_spot: function() {
            var $self = this;
            if (!$self.entry_spot && ticks_array.length > 0) {
                var contract_start_epoch = tt_chart.config.contract_start_time;
                for (var i=0;i < ticks_array.length;i++) {
                    var data = ticks_array[i];
                    if (data.epoch > contract_start_epoch) {
                        $self.entry_spot = data.quote;
                        break;
                    }
                }
            }

            if ($self.entry_spot && !tt_chart.config.has_indicator('tick_barrier')) {
                var barrier = new LiveChartIndicator.Barrier({
                    name: "tick_barrier",
                    value: $self.entry_spot,
                    color: 'green',
                    label: text.localize('Barrier')
                });
                tt_chart.add_indicator(barrier);
            }
        },
        reset: function() {
            if(tt_chart.ev)
                tt_chart.ev.close();
            current_tick_count = 0;
            ticks_array = [];
            this.entry_spot = null;
        },
        process_tick_trade: function() {
            var $self = this;

            var exit_data = ticks_array[ticks_array.length - 1];

            if (typeof exit_data !== 'undefined') {
                $self.exit_spot = exit_data.quote;
            }

            var last_tick_label = tt_chart.config.has_indicator('tick_barrier') ? $self.how_many_ticks() - 1 : $self.how_many_ticks();

            if ($self.exit_spot) {
                var exit = new LiveChartIndicator.Barrier({
                    name: "exit_spot",
                    value: new Date(exit_data.epoch*1000),
                    color: '#e98024',
                    axis : 'x',
                    label: text.localize('tick') + ' ' + last_tick_label,
                });
                tt_chart.add_indicator(exit);
            }

            if (tt_chart.config.with_tick_config) {
                $self.show_tick_expiry_outcome();
            }
        },
        show_tick_expiry_outcome: function() {
            var $self = this;

            $('#bet-confirm-exp').hide();
            $('#entry').text(': '+$self.entry_spot);
            $('#exit').text(': '+$self.exit_spot);

            var potential_payout = parseFloat($('#outcome-payout').data('payout').toString().replace(',',''));
            var cost = parseFloat($('#outcome-buyprice').data('buyprice').toString().replace(',',''));
            var final_price;
            $('#contract-confirmation-details').hide();

            if ($self.client_prediction() === 'up') {
                final_price = ($self.exit_spot > $self.entry_spot) ? potential_payout : 0;
            } else if ($self.client_prediction() === 'down') {
                final_price = ($self.exit_spot < $self.entry_spot) ? potential_payout : 0;
            }

            $('#contract-outcome-payout').text($self.round(final_price,2));

            if (final_price !== 0) {
                $('#bet-confirm-header').text(text.localize('This contract won'));
                $('#contract-outcome-profit').addClass('profit').text($self.round(potential_payout - cost,2));
            } else {
                $('#bet-confirm-header').text(text.localize('This contract lost'));
                $('#contract-outcome-label').removeClass('standout').text(text.localize('Loss'));
                $('#contract-outcome-profit').addClass('loss').text($self.round(cost,2));
            }

            $('#tick_info').show();
            $('#contract-outcome-details').show();
        },
        round: function(number,number_after_dec) {
            var result = Math.round(number * Math.pow(10,number_after_dec)) / Math.pow(10,number_after_dec);
            result = result.toFixed(number_after_dec);
            return result;
        },
    };
}();
