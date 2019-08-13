let location = require('./location.json');

export function getLocation() {
  let options = [];
  for (let item in location) {
    let option2 = [], obj = {};
    const sheng = location[item].name;
    obj.value = sheng;
    obj.label = sheng;
    options.push(obj);
    let cities = location[item].cities;
    for (let item2 in cities) {
      let option3 = [], obj2 = {};
      const shi = cities[item2].name;
      obj2.value = shi;
      obj2.label = shi;
      option2.push(obj2);
      obj.children = option2;
      let cities2 = cities[item2].districts;
      for (let item3 in cities2) {
        const qu = cities2[item3];
        option3.push({ value: qu, label: qu });
      }
      obj2.children = option3;
    }
  }
  return options;
}