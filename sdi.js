(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.loadDataset = function(url, xHeader, yHeader, sep, callback) {
        // Make an AJAX call to the dataset's URL
        $.ajax({
              url: url,
              dataType: 'text',
              success: function( datasetData ) {
                  // Got the data - parse it and return the List, seperated with sep
                  
                  // CSV Parser
                  var arr = datasetData.split('\n');
                  var jsonObj = [];
                  var headers = arr[0].split(',');
                  
                  for(var i = 1; i < arr.length; i++) {
                      var data = arr[i].split(',');
                      var obj = {};
                  
                      for(var j = 0; j < data.length; j++) {
                          obj[headers[j].trim()] = data[j].trim();
                      }
                      
                      jsonObj.push(obj);
                  }
                  // End of CSV Parser
                  var ret = [];
                  
                  for(var k = 0; k < jsonObj.length; k++) {
                      ret += jsonObj[k][xHeader] + sep + jsonObj[k][yHeader] + ",";
                  }
                  
                  callback(ret);
              }
        });
    };
    
    ext.shuffleList = function(list) {
        var j, x, i;
        
        for (i = list.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = list[i];
            list[i] = list[j];
            list[j] = x;
        }
        
        return list;
    }
    
    ext.splitList = function(list, sep, index) {
        return list.split(sep)[index]
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'Parse csv from %s where X is %s, Y is %s with seperator %s', 'loadDataset', 'https://itaysharon.github.io/cal_dataset.csv', 'total_rooms', 'median_house_value', '|'],
            ['r', 'Shuffle list %s', 'shuffleList', ''],
            ['r', 'Split list %s with seperator %s and get item #%n', 'splitList', '', '|', 0],
        ]
    };

    // Register the extension
    ScratchExtensions.register('Dataset Importer extension', descriptor, ext);
})({});
