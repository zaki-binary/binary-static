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
        initialize_chart: function(config) {
            var $self = this;

            var chart = new Highcharts.Chart({
                chart: {
                    type: 'line',
                    renderTo: config.render_to,
                    width: 401,
                    height: 90,
                    backgroundColor: null,
                    events: { load: $self.plot(config.plot_from, config.plot_to, config.contract_start) },
                },
                xAxis: {
                    type: 'datetime',
                    min: parseInt(config['plot_from']),
                    max: parseInt(config['plot_to']),
                    labels: {
                        enabled: false,
                    }
                },
                yAxis: {
                    title: '',
                    //min: config['y_range']['min'],
                    //max: config['y_range']['max'],
                },
                series: [{
                    data: [],
                }],
                title: '',
                exporting: {enabled: false, enableImages: false},
                legend: {enabled: false},
            });

            if (typeof config.x_indicators !== 'undefined') {
                $self.x_indicators = config.x_indicators;
            }

            if (typeof config.decimal !== 'undefined') {
                $self.decimal = config.decimal;
            }

            $self.chart = chart;
        },
        plot: function(plot_from, plot_to, contract_start) {
            var $self = this;

            var plot_from_moment = moment(plot_from).utc();
            var plot_to_moment = moment(plot_to).utc();
            var contract_start_moment = moment(contract_start).utc();
            var ticks_needed = $('#tick-count').data('count') + 1;
            $self.applicable_ticks = [];

            var symbol = BetForm.attributes.underlying();
            var stream_url = window.location.protocol + '//' + page.settings.get('streaming_server');
            stream_url += "/stream/ticks/" + symbol + "/" + plot_from_moment.unix() + "/" + plot_to_moment.unix();
            $self.ev = new EventSource(stream_url, { withCredentials: true });

            var counter=0;
            $self.ev.onmessage = function(msg) {
                if ($self.applicable_ticks.length >= ticks_needed) {
                    $self.ev.close();
                    return;
                    // evaluate conteact
                }

                var data = JSON.parse(msg.data);
                if (!(data[0] instanceof Array)) {
                    data = [ data ];
                }
                for (var i = 0; i < data.length; i++) {
                    if (data[i][0] === 'tick') {
                        var tick = {
                            epoch: parseInt(data[i][1]),
                            quote: parseFloat(data[i][2])
                        };
                        $self.chart.series[0].addPoint([tick.epoch*1000, tick.quote], true, false);

                        if (tick.epoch > contract_start_moment.unix()) {
                            $self.applicable_ticks.push(tick);

                            var tick_index = $self.applicable_ticks.length - 1;
                            var indicator_key = '_' + tick_index;

                            if (typeof $self.x_indicators[indicator_key] !== 'undefined') {
                                $self.x_indicators[indicator_key]['index'] = tick_index;
                                $self.add($self.x_indicators[indicator_key]);
                                delete $self.x_indicators[indicator_key];
                            }
                            var total = 0;
                            for (var i=0; i < $self.applicable_ticks.length; i++) {
                                total += parseFloat($self.applicable_ticks[i].quote);
                            }
                            var calc_barrier =  total/$self.applicable_ticks.length;
                            calc_barrier = calc_barrier.toFixed($self.decimal); // round calculated barrier

                            $self.chart.yAxis[0].removePlotLine('tick-barrier');
                            $self.chart.yAxis[0].addPlotLine({
                                id: 'tick-barrier',
                                value: calc_barrier,
                                color: 'green',
                                label: {
                                    text: 'barrier('+calc_barrier+')',
                                    align: 'center'
                                },
                                width: 2,
                            });
                        }
                    }
                }
            };
            $self.ev.onerror = function(e) {$self.ev.close(); };
        },
        add: function(indicator) {
            var $self = this;

            $self.chart.xAxis[0].addPlotLine({
               value: $self.applicable_ticks[indicator.index].epoch * 1000,
               id: indicator.id,
               label: {text: indicator.label},
               color: '#e98024',
               width: 2,
            });
        },
        /*client_prediction: function() {
            return $('#contract-sentiment').data('contract-sentiment');
        },
        asian_barrier: function() {
            var total = 0;

            for (var i=0; i < ticks_array.length; i++) {
                total += ticks_array[i].quote;
            }
            return total/ticks_array.length;
        },
        how_many_ticks: function() {
            return tt_chart.config.how_many_ticks;
        },
        process: function(current_tick) {
            var $self = this;

            $self.contract_type = $('#contract-type').data('contract-type');
            $self.contract_barrier = ($self.contract_type.match('FLASH')) ? $self.entry_spot : $self.asian_barrier();

            if (!$self.entry_spot && tt_chart.config.with_entry_spot) {
                $self.set_entry_spot();
            }

            if ($self.contract_type.match('ASIAN')) {
                if (tt_chart.config.has_indicator('tick_barrier')) {
                    tt_chart.remove_indicator('tick_barrier');
                }
                var barrier = new LiveChartIndicator.Barrier({
                    name: "tick_barrier",
                    value: $self.contract_barrier,
                    color: 'green',
                    label: text.localize('Barrier 2')
                });
                tt_chart.add_indicator(barrier);
            }

            if (current_tick) {
                if (tt_chart.config.with_tick_config) {
                    var tick_prediction = $self.client_prediction();
                    var win_pallet = 'rgba(46,136,54,0.1)';
                    var lose_pallet = 'rgba(204,0,0,0.05)';
                    var what_color;

                    if (tick_prediction === 'up') {
                        what_color = current_tick > $self.contract_barrier ? win_pallet: lose_pallet;
                    } else if (tick_prediction === 'down') {
                        what_color = current_tick < $self.contract_barrier ? win_pallet: lose_pallet;
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

            var entry_data;
            if (!$self.entry_spot && ticks_array.length > 0) {
                var contract_start_epoch = tt_chart.config.contract_start_time;
                for (var i=0;i < ticks_array.length;i++) {
                    var data = ticks_array[i];
                    if (data.epoch > contract_start_epoch) {
                        entry_data = data;
                        break;
                    }
                }
            }

            if (typeof entry_data !== 'undefined') {
                $self.entry_spot = entry_data.quote;
                if ($self.entry_spot && !tt_chart.config.has_indicator('tick_barrier')) {
                    var barrier = new LiveChartIndicator.Barrier({
                        name: "tick_barrier",
                        value: $self.entry_spot,
                        color: 'green',
                        label: text.localize('Barrier')
                    });
                    tt_chart.add_indicator(barrier);
                }

                if ($self.contract_type.match('ASIAN')) {
                    var entry_time = new LiveChartIndicator.Barrier({
                        name: 'contract_entry_time',
                        label: text.localize('tick 1'),
                        value: new Date(entry_data.epoch*1000),
                        color: '#e98024',
                        axis: 'x',
                        nomargin: true,
                    });
                    tt_chart.add_indicator(entry_time);
                }
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

            var last_tick_label = $self.contract_type.match('FLASH') ? $self.how_many_ticks() - 1 : $self.how_many_ticks();

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
                final_price = ($self.exit_spot > $self.contract_barrier) ? potential_payout : 0;
            } else if ($self.client_prediction() === 'down') {
                final_price = ($self.exit_spot < $self.contract_barrier) ? potential_payout : 0;
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
        },*/
    };
}();
