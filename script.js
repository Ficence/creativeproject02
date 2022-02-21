let url = "https://www.dnd5eapi.co/api/";
let stack = [];

const firstUpper = function(string){
  return replaceAll(string.charAt(0).toUpperCase()+string.slice(1), "_", " ");
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

const packObject = function(object){
  let keys = Object.keys(object);
  let values = Object.values(object);
  let newURL = "";
  let results = "";

  newURL = url.substring(0,23)+object.url;
  results += '<span><a class="inlineLinkButton" name="'+ newURL +'">' + object["name"]+'</a></span>';
  return results;
}

const searchObject = function(item){
  let keys = Object.keys(item);
  let values = Object.values(item);
  for(let i = 0; i < values.length; i++){
    if(typeof values[i] === 'object')
      return values[i];
  }
}

const retrieve_1 = function(url){
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      let results = "";
      for(let i = 0; i < Object.keys(json).length; i++){
	let keys = Object.keys(json);
	let values = Object.values(json);
	let newURL = url.substring(0,23)+values[i];
	results += '<div class="dndOption">'+'<a class="linkButton" name="'+ newURL +'">' + firstUpper(keys[i]) + '</a></div>';
      }
      document.getElementById("optionList").innerHTML = results;

      var elements = document.getElementsByClassName("linkButton");
      for (var i = 0; i < elements.length; i++) {
	let url2 = elements[i]["name"];
	elements[i].addEventListener("click", function() {
    stack.push(url);
	  let parent = document.getElementById('optionList');
	  while(parent.firstChild){
	    parent.removeChild(parent.firstChild);
	  }
	  retrieve_2(url2);
	});
      }
    });
}

const retrieve_2 = function(url){
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      let results = "";
      let indicies = json["results"];
      if(indicies !== undefined){
        for(let i = 0; i < indicies.length; i++){
	  let keys = Object.keys(indicies[i]);
	  let values = Object.values(indicies[i]);
	  results += '<div class="dndOption">';

	  for(let j = 0; j < keys.length; j++){
	    let newURL = url.substring(0,23)+indicies[i].url;
	    if(keys[j] !== "url" && keys[j] !== "index"){
	      results += '<a class="linkButton" name="'+ newURL +'">' + '<p>'+ firstUpper(keys[j])+': '+ values[j]+'</p></a>';
	    }
	  }
	  results += '</div>';
        }
        document.getElementById("optionList").innerHTML = results;

        var elements = document.getElementsByClassName("linkButton");
        for (var i = 0; i < elements.length; i++) {
	  let url2 = elements[i]["name"];
	  elements[i].addEventListener("click", function() {
      stack.push(url);
	    let parent = document.getElementById('optionList');
	    while(parent.firstChild){
	      parent.removeChild(parent.firstChild);
	    }
	    retrieve_2(url2);
	  });
        }
      }
      else{
	retrieve_3(url);
      }
    });
}

const retrieve_3 = function(url){
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      let keys = Object.keys(json);
      let values = Object.values(json);
      let results = "";
      results += '<div class="dndOption">';

      for(let i = 0; i < keys.length; i++){
        if(keys[i] !== 'index' && keys[i] !== 'url'){
          let con = firstUpper(keys[i]) + ": ";
          //If not an object
          if(typeof values[i] !== 'object'){
            results += '<a>' + '<p>'+ firstUpper(keys[i])+': '+ values[i]+'</p></a>';
            con += values[i];
          }
          else{
            //If is an object
            let temp = values[i];
            results += '<p>' + '<a>'+ firstUpper(keys[i])+': ';

            if(temp !== null){
              if(!Array.isArray(values[i])){
                temp = searchObject(values[i]);
              }
              //If not an Array of objects
              if(!Array.isArray(temp) && temp !== undefined){
                results += packObject(temp);
              }
              else if(temp !== undefined){//If it is an Array of objects
                for(let j = 0; j < temp.length; j++){
                  let temp2 = temp[j];
                  if(typeof temp2 !== 'string'){
                    while(temp2.name === undefined && typeof temp2[0] != 'string')
                      temp2 = searchObject(temp2);
                    if(j < temp.length-1){
                      results += packObject(temp2) + ", ";
                    }
                    else{
                      results += packObject(temp2);
                    }
                  }else{
                    results += '<span>'+ temp2+'</span>';
                  }
                }
              }
            }

            results += '</a></p>';
          }
        }
      }

      results += '</div>';
      document.getElementById("optionList").innerHTML = results;
      document.getElementsByClassName("dndOption")[0].style.width = "90%";

      document.getElementsByClassName("dndOption")[0].style.backgroundColor = "#33fcee";
      document.getElementsByClassName("dndOption")[0].addEventListener("mouseover", function(){
	document.getElementsByClassName("dndOption")[0].style.backgroundColor = "#33fcee";
      });

      var elements = document.getElementsByClassName("inlineLinkButton");
      for (var i = 0; i < elements.length; i++) {
	let url2 = elements[i]["name"];
	elements[i].addEventListener("click", function() {
    stack.push(url);
	  let parent = document.getElementById('optionList');
	  while(parent.firstChild){
	  parent.removeChild(parent.firstChild);
	  }
	  retrieve_3(url2);
	});
      }

    });
}



document.getElementById("Reset").addEventListener("click", retrieve_1(url));
document.getElementById("Back").addEventListener("click", function(){
  let item = stack.pop();
  if(item !== undefined){
    if(item === url){
      retrieve_1(item);
    }
    else{
      retrieve_2(item);
    }
  }
});
