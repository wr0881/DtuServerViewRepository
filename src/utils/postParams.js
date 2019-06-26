//处理post传参后台不能解析
export default (obj) => {
    let param = new URLSearchParams();
    for (let item in obj) {
        param.append(item, obj[item]);
    }
    return param;
}