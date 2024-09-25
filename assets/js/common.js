$(document).ready(function() {
  let power_type;
  getJsonData('/json/power_type.json').then(function(data) {
    power_type = data;
    console.log(power_type)
    power_type.type.forEach(type => {
      let row = `
        <div class="form-check form-check-inline">
          <input class="form-check-input type" type="checkbox" id="${type}" value="${type}">
          <label class="form-check-label" for="${type}">${type}</label>
        </div>
      `
      $("#type").append(row)
    });
  })

  let synergy;
  getJsonData('/json/start_synergy.json').then(function(data) {
    synergy = data;
    console.log(synergy)
    synergy.pure_synergy.forEach(pure_synergy => {
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
  })

  let specific_items;
  getJsonData('/json/specific_items.json').then(function(data) {
    specific_items = data;
    console.log(specific_items)
    specific_items.items.forEach(item => {
      let row = `
        <div class="form-check form-check-inline">
          <input class="form-check-input item" type="checkbox" id="${item}" value="${item}">
          <label class="form-check-label" for="${item}">${item}</label>
        </div>
      `
      $("#specific_items").append(row)
    });
  })

  let compositions;
  getJsonData('/json/compositions.json').then(function(data) {
    compositions = data;
    console.log(compositions)
    listCompositions(compositions.compositions)
  })
});

$(function() {
  $('body').on('change', '.form-check-input', function() {
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
    let count_true = type_true.length + pure_synergy_true.length + mix_synergy_true.length + item_true.length

    let compositions;
    getJsonData('/json/compositions.json').then(function(data) {
      compositions = data;
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
      console.log(ret)
      listCompositions(ret)
    })    

  });
});

function listCompositions(compositions){
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
    let mix_synagy = composition.mix_synergy.join()
    let items_div = ""
    composition.specific_items.forEach(item => {
      items_div += `<div>${item}</div>`
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
        <!-- <td>${mix_synagy}</td> -->
        <td>${items_div}</td>
        <td>${memo_div}</td>
      </tr>
    `
    $("#tbody").append(row)
  });
}

function getJsonData(jsonPath) {
  return new Promise(function(resolve, reject) {
      $.getJSON(jsonPath, function(data) {
          let jsonString = JSON.stringify(data);
          let jsonParsed = JSON.parse(jsonString);
          resolve(jsonParsed);
      }).fail(function(jqXHR, textStatus, error) {
          reject('JSONファイルの読み込みに失敗: ' + error);
      });
  });
}