describe("generateTableData", function(){
    it("should return <td></td>", function(){
       expect(CommonUI.generateTableData("Test data", "test-d")).toBeMatchedBy("td");
    });

    it("should add class passed in", function(){
        expect(CommonUI.generateTableData("Test data", "test-d")).toBeMatchedBy(".test-d");
    });

    it("should add text passed in", function(){
        expect(CommonUI.generateTableData("Test data", "test-d")).toContainText("Test data");
    });
})

describe("generateTableRow", function () {
   it("should return <tr></tr>", function(){
       const data = [new Date(), 101010101, "a test row"];
       const metadata = ["Date", "Ref", "Desc"];
       expect(CommonUI.generateTableRow(data, metadata, false)).toBeMatchedBy("tr");
    });

    it("should return multiple <td></td> if not header", function(){
        const data = [new Date(), 101010101, "a test row"];
        const metadata = ["Date", "Ref", "Desc"];
        expect(CommonUI.generateTableRow(data, metadata, false)).toContainElement("td");
    });

    it("should return multiple <th></th> if header", function(){
        const data = [new Date(), 101010101, "a test row"];
        const metadata = ["Date", "Ref", "Desc"];
        expect(CommonUI.generateTableRow(data, metadata, true)).toContainElement("th");
    });

    it("should throw error when data and metadata does not match", function(){
        const data = [new Date(), 101010101, "a test row"];
        const metadata = ["Date", "Ref", "Desc", "Super", "Extra"];
        expect(function(){
            CommonUI.generateTableRow(data, metadata, false);
        }).toThrow();
    });

    it("should contains all data passed in", function(){
        const data = ["10/10/2015", 101010101, "a test row"];
        const metadata = ["Date", "Ref", "Desc"];
        const $tbRowItems = CommonUI.generateTableRow(data, metadata, false).children();
        expect($tbRowItems.length).toBe(3);
        expect($tbRowItems.first()).toContainText("10/10/2015");
    });
});

describe("generateTable",function(){
   it("should create table using id provided", function(){
       const data = [
           ["qw", 25, "m"],
           ["ak", 36, "m"],
           ["ml", 35, "f"]
       ];
       const md = {
           id: "test-table",
           cols: ["name", "age", "gender"]
       };
       const $table = CommonUI.generateTable(data, md, false);
       expect($table).toBeMatchedBy("#test-table");
   });

    it("should create table using class provided", function(){
        const data = [
            ["qw", 25, "m"],
            ["ak", 36, "m"],
            ["ml", 35, "f"]
        ];
        const md = {
            class: "test",
            cols: ["name", "age", "gender"]
        };
        const $table = CommonUI.generateTable(data, md, false);
        expect($table).toBeMatchedBy(".test");
    });

    it("should return a <table></table>", function(){
        const data = [
            ["qw", 25, "m"],
            ["ak", 36, "m"],
            ["ml", 35, "f"]
        ];
        const md = {
            class: "test",
            cols: ["name", "age", "gender"]
        };
        const $table = CommonUI.generateTable(data, md, false);
        expect($table).toBeMatchedBy("table");
    });

    it("should contain data passed in", function(){
        const data = [
            ["qw", 25, "m"],
            ["ak", 36, "m"],
            ["ml", 35, "f"]
        ];
        const md = {
            class: "test",
            cols: ["name", "age", "gender"]
        };
        const $table = CommonUI.generateTable(data, md, false);
        const $tbody = $table.children().first();

        expect($tbody).toBeMatchedBy("tbody");
        expect($tbody.children().length).toBe(3);
        expect($tbody).toContainText("qw");
        expect($tbody).toContainText("ak");
        expect($tbody).toContainText("ml");
    });

    it("should contain header if specified", function(){
        const data = [
            ["qw", 25, "m"],
            ["ak", 36, "m"],
            ["ml", 35, "f"]
        ];
        const md = {
            class: "test",
            cols: ["name", "age", "gender"]
        };
        const $table = CommonUI.generateTable(data, md, ["name", "age", "gender"]);
        const $thead = $table.children().first();

        expect($thead).toBeMatchedBy("thead");
        expect($thead).toContainText("Name");
        expect($thead).toContainText("Age");
        expect($thead).toContainText("Gender");
    });
});