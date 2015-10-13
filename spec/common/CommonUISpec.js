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

    it("should throw error when data and metadata does not match", function(){
        const data = [new Date(), 101010101, "a test row"];
        const metadata = ["Date", "Ref", "Desc", "Super", "Extra"];
        expect(function(){
            CommonUI.generateTableRow(data, metadata, false);
        }).toThrow();
    });

});

