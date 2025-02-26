jQuery(document).ready(function($) {
    if (typeof rndapf_price_filter_params === 'undefined') {
        return false;
    }

    var priceSlider = document.getElementById('rndapf-noui-slider');
    var pricing = [];
    // price slider
    rndapfInitPriceSlider = function() {
        if ($('#rndapf-noui-slider').length) {
            var min_val = parseInt($(priceSlider).attr('data-min')),
                max_val = parseInt($(priceSlider).attr('data-max')),
                set_min_val = parseInt($(priceSlider).attr('data-set-min')),
                set_max_val = parseInt($(priceSlider).attr('data-set-max'));
            pricing = [min_val, min_val];
            $post_data['pricing'] = pricing;
            if (!set_min_val) {
                set_min_val = min_val;
            }

            if (!set_max_val) {
                set_max_val = max_val;
            }

            noUiSlider.create(priceSlider, {
                start: [set_min_val, set_max_val],
                step: 1,
                margin: 1,
                range: {
                    'min': min_val,
                    'max': max_val
                }
            });

            var min_val_holder = document.getElementById('rndapf-noui-slider-value-min'),
                max_val_holder = document.getElementById('rndapf-noui-slider-value-max');

            priceSlider.noUiSlider.on('update', function(values, handle) {
                if (handle) {
                    var value = parseInt(values[handle]);
                    //$post_data[max_val_holder] = value;
                    $(document).trigger('update_rndapf_slider_vals', [max_val_holder, value]);
                } else {
                    var value = parseInt(values[handle]);
                    // $post_data[min_val_holder] = value;
                    $(document).trigger('update_rndapf_slider_vals', [min_val_holder, value]);
                }
                pricing = values;
                $post_data['pricing'] = pricing;
            });

            priceSlider.noUiSlider.on('change', function(values, handle) {
                var params = rndapfGetUrlVars();

                if (handle) {
                    var max = parseInt(values[handle]),
                        filter_key = 'max-price';

                    // remove this parameter if set value is equal to max val
                    if (max == max_val) {
                        var query = rndapfRemoveQueryStringParameter(filter_key);
                        //history.pushState({}, '', query);
                        $post_data['query'] = query;

                    } else {
                        $post_data[filter_key] = max;
                        rndapfUpdateQueryStringParameter(filter_key, max);
                    }
                } else {
                    var min = parseInt(values[handle]),
                        filter_key = 'min-price';

                    // remove this parameter if set value is equal to min val
                    if (min == min_val) {
                        var query = rndapfRemoveQueryStringParameter(filter_key);
                        // history.pushState({}, '', query);
                        $post_data['query'] = query;
                    } else {
                        $post_data[filter_key] = min;
                        rndapfUpdateQueryStringParameter(filter_key, min);
                    }
                }
                pricing = values;
                $post_data['pricing'] = pricing;
                // filter products without reinitializing price slider
                rndapfFilterProducts($post_data);
            });
        }
    }

    // position currency symbol
    $(document).bind('update_rndapf_slider_vals', function(event, value_holder, value) {
        // if WooCommerce Currency Switcher plugin is activated
        if (typeof woocs_current_currency !== 'undefined') {
            if (woocs_current_currency.position === 'left') {
                $(value_holder).html(woocs_current_currency.symbol + value);
            } else if (woocs_current_currency.position === 'left_space') {
                $(value_holder).html(woocs_current_currency.symbol + ' ' + value);
            } else if (woocs_current_currency.position === 'right') {
                $(value_holder).html(value + woocs_current_currency.symbol);
            } else if (woocs_current_currency.position === 'right_space') {
                $(value_holder).html(value + ' ' + woocs_current_currency.symbol);
            }
        } else {
            if (rndapf_price_filter_params.currency_pos === 'left') {
                $(value_holder).html(rndapf_price_filter_params.currency_symbol + value);
            } else if (rndapf_price_filter_params.currency_pos === 'left_space') {
                $(value_holder).html(rndapf_price_filter_params.currency_symbol + ' ' + value);
            } else if (rndapf_price_filter_params.currency_pos === 'right') {
                $(value_holder).html(value + rndapf_price_filter_params.currency_symbol);
            } else if (rndapf_price_filter_params.currency_pos === 'right_space') {
                $(value_holder).html(value + ' ' + rndapf_price_filter_params.currency_symbol);
            }
        }
    });

    // initialize price slider
    rndapfInitPriceSlider();
});