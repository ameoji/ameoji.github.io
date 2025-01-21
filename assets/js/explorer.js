
let unit = []
let item = []
let augment = []

$(document).ready(function() {
  // a()

  // チャンピオンデータの取得と配置
  setChampions()

  // 紋章 / ヒーローデータの取得と配置
  setEmblems()

  generateURL()
});

function setChampions(champions){
  getJsonData('/json/explorer/champions.json').then(function(data) {
    let champions = data.champions
    champions.forEach(champion => {
      let s_3_2_1 = ""
      let s_5_4 = ""
      if(champion["cost"] == 5 || champion["cost"] == 4){
        s_5_4 = "selected"
      }else{
        s_3_2_1 = "selected"
      }
  
      let select = `
        <select class="form-select champion p-1 c${champion["cost"]}" id="${champion["eng_name"]}" style="padding: 0 .25rem!important">
          <option value="x" ${s_5_4}>Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="2,3">2+</option>
          <option value="1,2">2-</option>
          <option value="3" ${s_3_2_1}>3</option>
        </select>
      `
  
      let row = `
        <tr class="cost${champion["cost"]}">
          <td class="p-1">${champion["cost"]}</td>
          <td class="p-1">${champion["name"]}</td>
          <td class="p-1"><input class="form-check-input filter champion c${champion["cost"]}" type="checkbox" value="${champion["eng_name"]}"></td>
          <td class="p-1">${select}</td>
          <td class="p-1"><input class="form-check-input include champion c${champion["cost"]}" type="checkbox" value="${champion["eng_name"]}" checked></td>
        </tr>
      `
      $("#tbody_champion").append(row)
    });
  })
}

function setEmblems(){
  getJsonData('/json/explorer/emblems.json').then(function(data) {
    let emblems = data.emblems
    emblems.forEach(emblem => {
      let row = `
        <tr>
          <td class="p-1">${emblem["name"]}</td>
          <td class="p-1"><input class="form-check-input filter emblem" type="checkbox" value="${emblem["eng_name"]}"></td>
          <td class="p-1"><input class="form-check-input include emblem" type="checkbox" value="${emblem["eng_name"]}" checked></td>
        </tr>
      `
      $("#tbody_emblem").append(row)
    });
  })
}

function generateURL(){
  let base_url = "https://www.metatft.com/explorer?tab=comps"
  let url = base_url

  let url_unit = ""
  $(".champion.filter:checked").each(function(index, element){
    let is_include = $(`.champion.include[value=${element.value}]`)[0].checked
    let star = $(`#${element.value}>option:selected`).val()
    let url_unit_part = ""
    if(is_include){
      url_unit_part = `&unit=${element.value}_${star}_3`
    }else{
      url_unit_part = `&unit=!${element.value}_${star}_x`
    }
    url_unit += url_unit_part
    console.log(url_unit)
  });

  let url_item = ""
  $(".emblem.filter:checked").each(function(index, element){
    let is_include = $(`.emblem.include[value=${element.value}]`)[0].checked
    let url_emblem_part = ""
    if(is_include){
      url_emblem_part = `&item=TFT13_Item_${element.value}EmblemItem`
    }else{
      url_emblem_part = `&item=!TFT13_Item_${element.value}EmblemItem`
    }
    url_item += url_emblem_part
  });

  let is_hero_include = $("#hero").prop("checked")
  let url_augument = "&augment=!TFT13_Augment_BlueCarry&augment=!TFT13_Augment_ChainsawCarry&augment=!TFT13_Augment_FishCarry&augment=!TFT13_Augment_IreliaCarry&augment=!TFT13_Augment_PrimeCarry&augment=!TFT13_Augment_SingedCarry&augment=!TFT13_Augment_TrundleCarry&augment=!TFT13_Augment_VladCarry"
  let url_cost6 = "&unit=!TFT13_Viktor-1&unit=!TFT13_MissMage-1&unit=!TFT13_Warwick-1"

  if(is_hero_include){
    url_augument = ""
  }

  let url_8 = url + "&num_unit_slots=8" + url_unit + url_item + url_augument + url_cost6
  let url_9 = url + "&num_unit_slots=9" + url_unit + url_item + url_augument + url_cost6

  console.log(`url_unit: ${url_unit}`)
  console.log(`url_item: ${url_item}`)
  console.log(`url_augument: ${url_augument}`)
  
  $("#lv8").attr("href",url_8);
  $("#lv9").attr("href",url_9);
}

$(function() {
  $('body').on('change', '.champion', function() {
    generateURL()
  });
  $('body').on('change', '.emblem', function() {
    generateURL()
  });
  $('body').on('change', '#hero', function() {
    generateURL()
  });
});

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

function resetAll(){
  // フィルターを外す
  $(".champion.filter:checked").each(function(index, element){
    element.checked = false
  });
  $(".emblem.filter:checked").each(function(index, element){
    element.checked = false
  });
  // 含むを付ける
  $(".champion.include").each(function(index, element){
    element.checked = true
  });
  $(".emblem.include").each(function(index, element){
    element.checked = true
  });
  // 星を戻す
  $(".form-select.c5").each(function(index, element){
    element.value = "x"
  });
  $(".form-select.c4").each(function(index, element){
    element.value = "x"
  });
  $(".form-select.c3").each(function(index, element){
    element.value = "3"
  });
  $(".form-select.c2").each(function(index, element){
    element.value = "3"
  });
  $(".form-select.c1").each(function(index, element){
    element.value = "3"
  });


  // ヒーローを外す
  $("#hero").prop("checked", false)
  
  generateURL()
}

function reset5(){
  $(".champion.filter.c5:checked").each(function(index, element){
    element.checked = false
  });
  generateURL()
}

function reset23(){
  $(".champion.filter.c2:checked").each(function(index, element){
    element.checked = false
  });
  $(".champion.filter.c3:checked").each(function(index, element){
    element.checked = false
  });
  generateURL()
}

function reset1(){
  $(".champion.filter.c1:checked").each(function(index, element){
    element.checked = false
  });
  generateURL()
}

function resetEmblem(){
  $(".emblem.filter:checked").each(function(index, element){
    element.checked = false
  });
  generateURL()
}

function exclude5(){
  $(".champion.filter.c5").each(function(index, element){
    element.checked = true
  });
  $(".champion.include.c5").each(function(index, element){
    element.checked = false
  });
  generateURL()
}

function exclude5Star2(){
  exclude5()
  $(".form-select.c5").each(function(index, element){
    element.value = "2,3"
  });
  generateURL()
}

function exclude23Star3(){
  $(".champion.filter.c2").each(function(index, element){
    element.checked = true
  });
  $(".champion.include.c2").each(function(index, element){
    element.checked = false
  });
  $(".form-select.c2").each(function(index, element){
    element.value = "3"
  });
  $(".champion.filter.c3").each(function(index, element){
    element.checked = true
  });
  $(".champion.include.c3").each(function(index, element){
    element.checked = false
  });
  $(".form-select.c3").each(function(index, element){
    element.value = "3"
  });
  generateURL()
}

function exclude1Star3(){
  $(".champion.filter.c1").each(function(index, element){
    element.checked = true
  });
  $(".champion.include.c1").each(function(index, element){
    element.checked = false
  });
  $(".form-select.c1").each(function(index, element){
    element.value = "3"
  });
  generateURL()
}

function excludeEmblem(){
  $(".emblem.filter").each(function(index, element){
    element.checked = true
  });
  $(".emblem.include").each(function(index, element){
    element.checked = false
  });
  generateURL()
}

function a(){
  $.ajax({
    url: 'https://api.metatft.com/tft-explorer-api/total?formatnoarray=true&queue=1100&patch=current&days=1&rank=CHALLENGER,DIAMOND,GRANDMASTER,MASTER&permit_filter_adjustment=true&unit_tier_numitems_unique=TFT13_Zoe-1_.*_3&augment=!TFT13_Augment_BlueCarry&augment=!TFT13_Augment_ChainsawCarry&augment=!TFT13_Augment_FishCarry&augment=!TFT13_Augment_IreliaCarry&augment=!TFT13_Augment_PrimeCarry&augment=!TFT13_Augment_SingedCarry&augment=!TFT13_Augment_TrundleCarry&augment=!TFT13_Augment_VladCarry',
    type: 'get',
    cache: false,
    dataType:'json',
  })
  .done(function(response) { 
    console.log(response)
  });
}