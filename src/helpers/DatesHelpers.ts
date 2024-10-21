export const compareDates = (firstDate:Date,secondDate:Date):boolean=>
    (
        firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate()
    )