var DatepickerUtil = (function(){

    /***
     * initialize datepicker specified by id
     * @param id    id of dom
     * @param date
     * @param min
     * @param max
     */
   function initDatepicker(id, date, min, max){
        if (isNaN(min) || isNaN(max)) {
            throw "min and max should both be number";
        }

        var utcMoment = moment.utc(date).locale("en");
        var utcMomentString = utcMoment.format("YYYY-MM-DD").toString();

        if (!Modernizr.inputtypes.date) {
           var utcDate = Date.parse(utcMomentString);
           $("#" + id).
               datepicker({
                   maxDate: isUndefined(max) ? max : null,
                   minDate: isUndefined(min) ? min : null,
                   dateFormat: 'yy-mm-dd'}).
               datepicker("setDate", utcDate);
           return;
       }

       $("#" + id).val(utcMomentString);
       if (max) {
           var maxMoment = utcMoment.add(max, "d");
           $("#" + id).attr("max", maxMoment.format("YYYY-MM-DD").toString());
       }

       if (min) {
           var minMoment = utcMoment.subtract(min, "d");
           $("#" + id).attr("min", minMoment.format("YYYY-MM-DD").toString());
       }
   }


    return {
        initDatepicker: initDatepicker
    };
}())