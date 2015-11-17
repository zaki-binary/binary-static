var LimitsUI = (function(){
    "use strict";
    var tableID = "client-limits";
    var columns = ["Item", "Limit"];

    function createEmptyLimitsTable(){
        var header = [
            Content.localize().textItem,
            Content.localize().textLimit
        ];

        header[1] = header[1] + " (" + TUser.get().currency + ")";

        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $tableContainer = Table.createFlexTable(data, metadata, header);
        return $tableContainer;
    }

    function clearTableContent(){
        Table.clearTableBody(tableID);
        $("#" + tableID +">tfoot").hide();
    }

    function createLimitsRow(limits){
        var $LimitsRow = Table.createFlexTableRow([Content.localize().textMaxOpenPosition, limits["open_positions"]], columns, "data");
    }
    
    return {
        clearTableContent: clearTableContent,
        createEmptyLimitsTable: createEmptyLimitsTable,
        createLimitsRow: createLimitsRow
    };
}());
