module.exports={
    getDate,
    getDay
};
function getDate(){
    let today=new Date();
    let options={
        weekday:"long",
        day:"numeric",
        year:"numeric",
        month:"long"
    };
    let Day=today.toLocaleString("en-US",options);
    return Day;
}
function getDay(){
    let today=new Date();
    let options={
        weekday:"long",
    };
    let Day=today.toLocaleString("en-US",options);
    return Day;
}