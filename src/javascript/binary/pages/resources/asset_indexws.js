var AssetIndexWS = (function() {
    "use strict";

    var $container = $('#asset-index'),
        $tabs,
        $contents;
    var activeSymbols,
        assetIndex;
    var marketColumns = {};
    // TODO: refactor all hardcoded indexes
    // var idxAssets = {
    //   symbol: 0,
    //   displayName: 1,
    //   cells: 2,
        //   cellName: 0,
        //   cellDisplayName: 1,
        //   cellFrom: 2,
        //   cellTo: 3
    //};

    // Search
    var getSymbolInfo = function(qSymbol) {
        return activeSymbols.filter(function(sy) {
            return sy.symbol === qSymbol;
        });
    };

    var init = function() {
        showLoadingImage($container);
        BinarySocket.send({"active_symbols": "brief"});
        BinarySocket.send({"asset_index": 1});
    };

    var getActiveSymbols = function(response) {
        activeSymbols = response.active_symbols;
        if(assetIndex) {
            populateTable();
        }
    };

    var getAssetIndex = function(response) {
        assetIndex = response.asset_index;
        if(activeSymbols) {
            populateTable();
        }
    };

    var populateTable = function() {
        $('#errorMsg').addClass('hidden');

        var isJapan = page.language().toLowerCase() === 'ja';
        
        $tabs = $('<ul/>', {class: isJapan ? 'hidden' : ''});
        $contents = $('<div/>');

        for(var i = 0; i < assetIndex.length; i++) {
            var assetItem = assetIndex[i];
            var symbolInfo = getSymbolInfo(assetItem[0])[0];

            // just show "Major Pairs" when the language is JA
            if(isJapan && symbolInfo.submarket !== 'major_pairs') {
                continue;
            }            

            var $submarketTable = getSubmarketTable(assetItem, symbolInfo);
            $submarketTable.find('tbody').append(createSubmarketTableRow(assetItem, symbolInfo));
        }

        $container
            .empty()
            .append($tabs)
            .append($('<div/>', {class: 'grd-row-padding'}))
            .append($contents.children());

        $container.tabs('destroy').tabs();
    };

    var getSubmarketTable = function(assetItem, symbolInfo) {
        var marketID = 'market-' + symbolInfo.market;
        var submarketID = 'submarket-' + symbolInfo.submarket;
        
        var $table = $contents.find('#' + submarketID);
        if($table.length === 0) {
            // Create the table for this submarket
            var $market = $contents.find('#' + marketID);
            if($market.length === 0) {
                // Create the market and tab elements
                $market = $('<div/>', {id: marketID});
                $tabs.append($('<li/>').append($('<a/>', {href: '#' + marketID, text: symbolInfo.market_display_name, id: 'outline'})));
            }
            $table = createEmptyTable(assetItem, symbolInfo, submarketID);
            $market.append($table);
            $contents.append($market);
        }

        return $table;
    };

    var createSubmarketTableRow = function(assetItem, symbolInfo) {
        var cells   = [symbolInfo.display_name],
            columns = ["asset"];

        var assetCells = assetItem[2];
        for(var i = 0; i < assetCells.length; i++) {
            cells.push(assetCells[i][2] + ' - ' + assetCells[i][3]);
            columns.push(assetCells[i][0]);
        }
        // Remained empty cells
        for(var i = assetCells.length; i < marketColumns[symbolInfo.market].columns.length - 1; i++) {
            cells.push("");
            columns.push(marketColumns[symbolInfo.market].columns[i]);
        }

        return Table.createFlexTableRow(cells, columns, "data");
    };

    var createEmptyTable = function(assetItem, symbolInfo, submarketID) {
        var assetCells = assetItem[2];
        var market = symbolInfo.market;

        // Generate market coulmns to use in all this market's submarket tables
        if(!(market in marketColumns)) {
            marketColumns[market] = {
                header: [""],
                columns: [""]
            };

            for(var i = 0; i < assetCells.length; i++) {
                marketColumns[market].header.push(text.localize(assetCells[i][1]));
                marketColumns[market].columns.push(assetCells[i][0]);
            }
        }
        else if (marketColumns[market].columns.length < assetCells.length) {
            for(var i = 0; i < assetCells.length; i++) {
                if(!(assetCells[i][1] in marketColumns[market].columns)) {
                    marketColumns[market].header.push(text.localize(assetCells[i][1]));
                    marketColumns[market].columns.push(assetCells[i][0]);
                }
            }
        }

        var metadata = {
            id: submarketID,
            cols: marketColumns[market].columns
        };

        var $submarketTable = Table.createFlexTable([], metadata, marketColumns[market].header);
        
        var $submarketHeader = $('<tr/>', {class: 'flex-tr'})
            .append($('<th/>', {class: 'flex-tr-child submarket-name', colspan: marketColumns[market].columns.length, text: symbolInfo.submarket_display_name}));
        $submarketTable.find('thead').prepend($submarketHeader);

        return $submarketTable;
    };


    return {
        init: init,
        getAssetIndex: getAssetIndex,
        getActiveSymbols: getActiveSymbols
    };
}());



pjax_config_page("asset_indexws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        if (response.msg_type === "asset_index") {
                            AssetIndexWS.getAssetIndex(response);
                        }
                        else if (response.msg_type === "active_symbols") {
                            AssetIndexWS.getActiveSymbols(response);
                        }
                    }
                }
            });

            Content.populate();
            AssetIndexWS.init();
        }
    };
});
