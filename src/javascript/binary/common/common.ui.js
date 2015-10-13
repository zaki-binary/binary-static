const CommonUI = (function(){
    "use strict";
   /**
    * generateTableRow() generate <tr>
    * using data as value following metadata provided
    *
    * eg.
    *   data = ["03/08/2012", "35.70"];
    *
    *   metadata = ["date","price"];
    *
    * @param {Object} data
    * @param {Object} metadata
    * @param {Boolean} header
    * @return {Object} tableRow <tr>
    */
    function generateTableRow(data, metadata, header){
       if (data.length !== metadata.length) {
           throw "Row data and metadata does not match";
       }

       const $row = $("<tr></tr>");

       for (var i = 0; i < metadata.length ; i++) {
           const className = metadata[i].replace(/\s+/g, "-");
           generateTableData(data[i], className, header).appendTo($row);
       }
       return $row;
    }

    /***
     * generateTableData return a <td></td> DOM
     * using data and schema provided
     * eg.
     *  data = "Halo World";
     *  class = "date-col";
     * @param {String} data
     * @param {String} classnames
     * @param {Boolean} header
     * @return {Object} tableData <td>
     */
    function generateTableData(data, classnames, header){
        const domString = (header === true) ? "<th></th>" : "<td></td>";
        const elementText = (header === true) ? CommonUtility.toTitleCase(data.toString()) : data.toString();
        const $rowItem = $(domString, {
            class: classnames,
            text: elementText
        });

        return $rowItem;
    }

    /***
     * Generate Table DOM using data and metadata provided
     * eg.
     *  data = [
     *      ["row1a", "row1b"],
     *      ["row2a", "row2b"]
     *  ];
     *  metadata = {
     *      class: ["names", "red"],
     *      id: "unique-table",
     *      cols: ["col1", "col2"]
     *  }
     * @param {Object} data
     * @param {Object} metadata
     * @param {Array} headerTitles
     * @return {Object} table <table>
     */
    function generateTable(data, metadata, headerTitles){
        const classString = (metadata.class) ? metadata.class : "";
        const idString = (metadata.id) ? metadata.id : "";
        const $table = $("<table></table>", {class: classString, id: idString});

        if (headerTitles) {
            if (headerTitles.length !== metadata.cols.length) {
                throw "Header does not match metadata";
            }
            const $header = $("<thead></thead>");
            generateTableRow(headerTitles, metadata.cols, true).appendTo($header);
            $header.appendTo($table);
        }

        const $tbody = $("<tbody></tbody>");
        for (var i = 0 ; i < data.length ; i++) {
            generateTableRow(data[i], metadata.cols, false).appendTo($tbody);
        }

        $tbody.appendTo($table);
        return $table;
    }

    return {
        generateTableRow: generateTableRow,
        generateTableData: generateTableData,
        generateTable: generateTable
    };
}());