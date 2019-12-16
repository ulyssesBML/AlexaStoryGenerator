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
var dataset_node = new vis.DataSet();
var dataset_edge = new vis.DataSet();

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
    nodes: {
      shape: "box",
      margin: 10,
      widthConstraint: {
        maximum: 200
      }
    },
    edges: {
      smooth: true,
      arrows: { to: true }
    },
    //layout:{
    //  hierarchical: {
    //    direction: "UD",
    //    nodeSpacing: 500,
    //  }
    //},
    //physics: {
    //  hierarchicalRepulsion: {
    //    avoidOverlap: 1,
    //    centralGravity: 0,
    //    springLength: 50,
    //    nodeDistance: 500
    //  },
    //  minVelocity: 0.75,
    //  solver: "hierarchicalRepulsion"
//
    //},
    layout:{
      randomSeed:5
    },
    physics: {
      enabled:true,
      barnesHut: {
        gravitationalConstant: -10000,
        centralGravity: 0,
        springConstant: 0.0,
        damping: 1.0,
        avoidOverlap: 1
      },
      maxVelocity: 150,
      minVelocity: 0.75,
      timestep: 0.1,
      solver: 'barnesHut'
    },
    //physics: false,
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
          //dataset_node.add(data);
        }
          document.getElementById("cancelButton").onclick = clearPopUp.bind();
          document.getElementById("network-popUp").style.display = "block";
      },
      deleteNode: function(data, callback) {
        callback(data)
        //dataset_node.remove(data.nodes)
        //dataset_node.remove(data.edges)
        
      },
      editNode: function(data, callback) {
        // filling in the popup DOM elements
        document.getElementById("operation").innerHTML = "Edit Node";
        document.getElementById("node-id").value = data.id;
        document.getElementById("node-label").value = data.label;
        document.getElementById("saveButton").onclick = () =>{ 
          saveData(data, callback);
          //dataset_node.update(data);
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
          //dataset_edge.add(data)
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
          //dataset_edge.update(data)
        }


        document.getElementById("cancelButton").onclick = cancelEdit.bind(
          this,
          callback
        );
        document.getElementById("network-popUp").style.display = "block";
      },
      deleteEdge: function(data,callback){
        callback(data)
        //dataset_edge.remove(data.edges)
      }
    }
  };
  all_data_set = {
    nodes: dataset_node,
    edges:dataset_edge
  }
  network = new vis.Network(container, all_data_set, options);
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

function save_story(){
  var textFile = null
  dt_nodes = dataset_node.get().map(x => {
    return {'id':x.id,'label':x.label}
  }); 
  dt_edge = dataset_edge.get().map(x => {
    return{'to':x.to, 'from':x.from,'label':x.label, 'arrows':x.arrows}
  });
  
  name = document.getElementById("name").value
  
  if(name === ""){
    alert("Coloque um nome na historia.");
  }
  else if(dt_nodes === []){
    alert("Não há nos nesse grafo.");
  }
  else if(dt_edge === []){
    alert("Não há arestas nesse grafo");
  }
  else{
    axios.post("https://mog4tqj6u5.execute-api.sa-east-1.amazonaws.com/default/AlexaStroy", {
      'name': name,
      'story':{'nodes':dt_nodes,'edges':dt_edge}
    })
    .then(function (response) {
      alert("Salvo")
      console.log(response.data);
    })
    .catch(function (error) {
      alert("Erro ao salvar: "+error)
      console.log(error);
    });
  }
}

function importNetwork() {
  axios.get("https://mog4tqj6u5.execute-api.sa-east-1.amazonaws.com/default/AlexaStroy/2")
  .then(response => {
    response.data.Item.story.nodes.map(x => {
      if (x.id == 0){
        x['color'] = 'lime'
        //x['level'] = 0
      }
      else{
        //x['level'] = calc_level(parseInt(x['id']))
      }

      return x;
    })
    dataset_node = new vis.DataSet(response.data.Item.story.nodes)
    dataset_edge = new vis.DataSet(response.data.Item.story.edges)
    
    let aux_num = dataset_node.getIds(); 
    for(i in aux_num){
      if(parseInt(aux_num[i],10) > id_count){
        id_count = parseInt(aux_num[i],10);
      }      
    }
    id_count = id_count +1;


    aux_num = dataset_edge.getIds(); 
    for(i in aux_num){
      if(parseInt(aux_num[i],10) > id_count_edge){
        id_count_edge = parseInt(aux_num[i],10);
      }      
    }
    id_count_edge = id_count_edge +1;

    draw()
  })
}


window.addEventListener("load", () => {
  init();
});

