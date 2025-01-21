$(document).ready(async function() {
  const power_type = await getJsonData('/json/compositions/power_type.json')
  power_type.type.forEach(type => {
    let row = `
      <div class="form-check form-check-inline">
        <input class="form-check-input type" type="checkbox" id="${type}" value="${type}">
        <label class="form-check-label" for="${type}">${type}</label>
      </div>
    `
    $("#type").append(row)
  });

  const synergy = await getJsonData('/json/compositions/start_synergy.json')
  synergy.pure_synergy_display.forEach(pure_synergy => {
    let row = `
      <div class="form-check form-check-inline">
        <input class="form-check-input pure_synergy" type="checkbox" id="${pure_synergy}" value="${pure_synergy}">
        <label class="form-check-label" for="${pure_synergy}">${pure_synergy}</label>
      </div>
    `
    $("#pure_synergy").append(row)
  });
  synergy.mix_synergy.forEach(mix_synergy => {
    let row = `
      <div class="form-check form-check-inline">
        <input class="form-check-input mix_synergy" type="checkbox" id="${mix_synergy}" value="${mix_synergy}">
        <label class="form-check-label" for="${mix_synergy}">${mix_synergy}</label>
      </div>
    `
    $("#mix_synergy").append(row)
  });

  const start_champions = await getJsonData('/json/compositions/start_champions.json')
  start_champions.start_champions_display.forEach(ch => {
    let row = `
      <div class="form-check form-check-inline">
        <input class="form-check-input start_champion" type="checkbox" id="${ch.name}" value="${ch.name}">
        <label class="form-check-label" for="${ch.name}">${ch.name}</label>
      </div>
    `
    $("#start_champions").append(row)
  });

  const specific_items = await getJsonData('/json/compositions/specific_items.json')
  specific_items.items.forEach(item => {
    let row = `
      <div class="form-check form-check-inline">
        <input class="form-check-input item" type="checkbox" id="${item}" value="${item}">
        <label class="form-check-label" for="${item}">${item}</label>
      </div>
    `
    $("#specific_items").append(row)
  });

  const compositions = await getJsonData('/json/compositions/compositions.json')
  listCompositions(compositions.compositions)
});

$(function() {
  $('body').on('change', '.form-check-input', async function() {
    let type_true = []
    $(".type").each(function () {
      if($(this).is(":checked")){
        type_true.push($(this).val())
      }
    });
    let pure_synergy_true = []
    $(".pure_synergy").each(function () {
      if($(this).is(":checked")){
        pure_synergy_true.push($(this).val())
      }
    });
    let mix_synergy_true = []
    $(".mix_synergy").each(function () {
      if($(this).is(":checked")){
        mix_synergy_true.push($(this).val())
      }
    });
    let start_champion_true = []
    $(".start_champion").each(function () {
      if($(this).is(":checked")){
        start_champion_true.push($(this).val())
      }
    });
    let item_true = []
    $(".item").each(function () {
      if($(this).is(":checked")){
        item_true.push($(this).val())
      }
    });
    let condition = $('input[name="condition"]:checked').val()
    // console.log(type_true)
    // console.log(pure_synergy_true)
    // console.log(mix_synergy_true)
    // console.log(item_true)
    // console.log(condition)
    let count_true = type_true.length + pure_synergy_true.length + mix_synergy_true.length  + start_champion_true.length + item_true.length

    const compositions = await getJsonData('/json/compositions/compositions.json')
    $('#tbody').html('')
    if(count_true == 0){
      listCompositions(compositions.compositions)
      return;
    }
    ret = []
    compositions.compositions.forEach(composition => {
      let is_add_and = true
      let is_add_or = false
      type_true.forEach(type => {
        if(condition == "AND"){
          if(composition.power_type.includes(type) == false){
            is_add_and = false
            return;
          }
        }else{
          if(composition.power_type.includes(type)){
            is_add_or = true
            return;
          }
        }
      });

      pure_synergy_true.forEach(pure_synergy => {
        if(condition == "AND"){
          if(composition.pure_synergy.includes(pure_synergy) == false){
            is_add_and = false
            return;
          }
        }else{
          if(composition.pure_synergy.includes(pure_synergy)){
            is_add_or = true
            return;
          }
        }
      });

      mix_synergy_true.forEach(mix_synergy => {
        if(condition == "AND"){
          if(composition.mix_synergy.includes(mix_synergy) == false){
            is_add_and = false
            return;
          }
        }else{
          if(composition.mix_synergy.includes(mix_synergy)){
            is_add_or = true
            return;
          }
        }
      });

      start_champion_true.forEach(start_champion => {
        if(condition == "AND"){
          if(composition.start_champions.includes(start_champion) == false){
            is_add_and = false
            return;
          }
        }else{
          if(composition.start_champions.includes(start_champion)){
            is_add_or = true
            return;
          }
        }
      });

      item_true.forEach(item => {
        if(condition == "AND"){
          if(composition.specific_items.includes(item) == false){
            is_add_and = false
            return;
          }
        }else{
          if(composition.specific_items.includes(item)){
            is_add_or = true
            return;
          }
        }
      });
      if(condition == "OR" && is_add_or){
        ret.push(composition);
      }
      if(condition == "AND" && is_add_and){
        ret.push(composition);
      }
    });
    listCompositions(ret)

  });
});

async function listCompositions(compositions){
  const start_champions = await getJsonData('/json/compositions/start_champions.json')
  
  compositions.forEach(composition => {
    let features_div = ""
    composition.features.forEach(feature => {
      features_div += `<div>${feature}</div>`
    });
    let type_div = ""
    composition.power_type.forEach(type => {
      type_div += `<div>${type}</div>`
    });
    let pure_synagy_div = ""
    composition.pure_synergy.forEach(pure_synergy => {
      pure_synagy_div += `<div>${pure_synergy}</div>`
    });
    let start_champions_div = ""
    composition.start_champions.forEach(start_champion => {
      let cost = ""
      start_champions.start_champions_display.forEach(start_champion_d => {
        if(start_champion == start_champion_d.name){
          cost = start_champion_d.cost
        }
      })
      start_champions_div += `<div>${cost}: ${start_champion}</div>`
    });
    let mix_synagy = composition.mix_synergy.join()
    let items_div = ""
    composition.specific_items.forEach(item => {
      items_div += `<div>${item}</div>`
    });
    let buff_debuff_div =""
    composition.buff_debuff.forEach(buff_debuff => {
      buff_debuff_div += `<div>${buff_debuff}</div>`
    });
    let memo_div = ""
    composition.memo.forEach(memo => {
      memo_div += `<div>${memo}</div>`
    });

    let row = `
      <tr class="${composition.evaluation}">
        <td>${composition.name}</td>
        <td>${composition.evaluation}</td>
        <td>${features_div}</td>
        <td>${type_div}</td>
        <td>${pure_synagy_div}</td>
        <td>${start_champions_div}</td>
        <!-- <td>${mix_synagy}</td> -->
        <td>${buff_debuff_div}</td>
        <td>${items_div}</td>
        <td>${memo_div}</td>
      </tr>
    `
    $("#tbody").append(row)
  });
}

async function getJsonData(jsonPath) {
  const data = await $.getJSON(jsonPath);
  let jsonString = JSON.stringify(data);
  let jsonParsed = JSON.parse(jsonString);
  return jsonParsed
}

// function getJsonData(jsonPath) {
//   return new Promise(function(resolve, reject) {
//       $.getJSON(jsonPath, function(data) {
//           let jsonString = JSON.stringify(data);
//           let jsonParsed = JSON.parse(jsonString);
//           resolve(jsonParsed);
//       }).fail(function(jqXHR, textStatus, error) {
//           reject('JSONファイルの読み込みに失敗: ' + error);
//       });
//   });
// }

