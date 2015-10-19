/**
 * Created by qingwei on 10/13/15.
 */

const CommonUtility = (function(){
    function toTitleCase(str){
        return str.replace(/\w[^\s\/\\]*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    /***
     *
     * @param {Date} date
     * @returns {*[]}
     */
    function dateToStringWithoutTime(date){
        return [date.getDate(), date.getMonth()+1, date.getFullYear()].join("/");
    }

    return {
        toTitleCase: toTitleCase,
        dateToStringWithoutTime: dateToStringWithoutTime
    };
}());

