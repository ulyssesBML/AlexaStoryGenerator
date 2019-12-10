var id_count = 1;
var id_count_edge = 1;
var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
//var data = getScaleFreeNetwork(25);
//data = {'nodes':[],'edges':[]}
//console.log(data)

var seed = 2;
var dataset_node, dataset_edge;

function setDefaultLocale() {
  var defaultLocal = navigator.language;
  var select = document.getElementById("locale");
  select.selectedIndex = 0; // set fallback value
  for (var i = 0, j = select.options.length; i < j; ++i) {
    if (select.options[i].getAttribute("value") === defaultLocal) {
      select.selectedIndex = i;
      break;
    }
  }
}

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function draw() {
  destroy();
  nodes = [];
  edges = [];

  // create a network
  var container = document.getElementById("mynetwork");
  var options = {
    layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
    locale: document.getElementById("locale").value,
    manipulation: {
      addNode: function(data, callback) {
        // filling in the popup DOM elements
        document.getElementById("operation").innerHTML = "Add Node";
        document.getElementById("node-id").value = id_count;
        document.getElementById("node-label").value = data.label;
        document.getElementById("saveButton").onclick = () => {
          saveData(data,callback);
          id_count = id_count + 1;
          dataset_node.add(data);
        }
          document.getElementById("cancelButton").onclick = clearPopUp.bind();
          document.getElementById("network-popUp").style.display = "block";
      },
      deleteNode: function(data, callback) {
        callback(data)
        dataset_node.remove(data.nodes)
        dataset_node.remove(data.edges)
        
      },
      editNode: function(data, callback) {
        // filling in the popup DOM elements
        document.getElementById("operation").innerHTML = "Edit Node";
        document.getElementById("node-id").value = data.id;
        document.getElementById("node-label").value = data.label;
        document.getElementById("saveButton").onclick = () =>{ 
          saveData(data, callback);
          dataset_node.update(data);
        }
          document.getElementById("cancelButton").onclick = cancelEdit.bind(
            this,
            callback
            );
          document.getElementById("network-popUp").style.display = "block";
      },
      addEdge: function(data, callback) {
        // filling in the popup DOM elements
        document.getElementById("operation").innerHTML = "Add Node";
        document.getElementById("node-label").value = data.label;
        document.getElementById("node-id").value = id_count_edge;
        
        data.arrows = "to";
        
        document.getElementById("saveButton").onclick = () => {
          console.log(data)
          data.id = document.getElementById("node-id").value;
          data.label = document.getElementById("node-label").value;
          clearPopUp();
          callback(data);
          dataset_edge.add(data)
          id_count_edge = id_count_edge + 1;
        }

        document.getElementById("cancelButton").onclick = cancelEdit.bind(
          this,
          callback
        );
        document.getElementById("network-popUp").style.display = "block";
      },
      editEdge: function(data, callback) {
        // filling in the popup DOM elements
        document.getElementById("operation").innerHTML = "Edit Node";
        document.getElementById("node-label").value = data.label;
        document.getElementById("node-id").value = data.id;
        data.arrows = "to";
        
        document.getElementById("saveButton").onclick = () => {
          data.id = document.getElementById("node-id").value;
          data.label = document.getElementById("node-label").value;
          clearPopUp();
          callback(data);
          dataset_edge.update(data)
        }


        document.getElementById("cancelButton").onclick = cancelEdit.bind(
          this,
          callback
        );
        document.getElementById("network-popUp").style.display = "block";
      },
      deleteEdge: function(data,callback){
        callback(data)
        dataset_edge.remove(data.edges)
      }
    }
  };
 
  dataset_node = new vis.DataSet(options);
  dataset_edge = new vis.DataSet(options);
  network = new vis.Network(container, dataset_node, options);
}

function clearPopUp() {
  document.getElementById("saveButton").onclick = null;
  document.getElementById("cancelButton").onclick = null;
  document.getElementById("network-popUp").style.display = "none";
}

function cancelEdit(callback) {
  clearPopUp();
  callback(null);
}

function saveData(data, callback) {
  data.id = document.getElementById("node-id").value;
  data.label = document.getElementById("node-label").value;
  clearPopUp();
  callback(data);
}

function init() {
  setDefaultLocale();
  draw();
}

var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], {
                type: 'text/plain'
            });

            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
        };


function downloadContent(name, content) {
  var atag = document.createElement("a");
  var file = new Blob([content], {type: 'text/plain'});
  atag.href = URL.createObjectURL(file);
  atag.download = name;
  atag.click();
}

function generate_csv(){
  var textFile = null
  my_str = "";
  dt_nodes = dataset_node.get(); 
  dt_edge = dataset_edge.get();
  
  my_str = JSON.stringify({'nodes':dt_nodes,'edges':dt_edge});
  
  console.log(my_str)

  fetch("https://mog4tqj6u5.execute-api.sa-east-1.amazonaws.com/default/AlexaStroy",
  {
    method: "POST",
    body: my_str
  })
  .then(response => {
    console.log(response)
  })
  
}



window.addEventListener("load", () => {
  init();
});
