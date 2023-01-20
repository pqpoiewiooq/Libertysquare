class DateTime {
    date;
    time;

    constructor(date, time) {
        this.date = date || new Date();
        if(time && DateTime.isTime(time)) {
            this.time = time;
        } else {
            var hours = this.date.getHours();
            hours = hours >= 10 ? hours : '0' + hours;
            var minutes = this.date?.getMinutes();
            minutes = minutes >= 10 ? minutes : '0' + minutes;
            this.time = `${hours}:${minutes}`;
        }

        this.toString = this.toString.bind(this);
    }

    /**
     * HH:mm 형식이 맞는지 확인
     * @returns boolean
     */
    static isTime = function(time) {
        return (/(0[1-9]|1[0-9]|2[0-4]):(0[1-9]|[1-5][0-9])/.test(time));
    }

    /**
     * @returns string to 'yyyy-MM-dd HH:mm'
     */
    toString = function() {
        if(!(this.date instanceof Date)) return;
        if(!DateTime.isTime(this.time)) return;

        var year = this.date.getFullYear();
        var month = (this.date.getMonth() + 1);
        month = month >= 10 ? month : '0' + month;
        var day = this.date.getDate();
        day = day >= 10 ? day : '0' + day;

        return `${year}-${month}-${day} ${this.time}`;
    }
}