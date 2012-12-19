 function autocompleteInit(widget, hlPreTag, hlPostTag) {
      hlPreTag = typeof(hlPreTag) === 'undefined'? "<strong id=autocomplete>" : hlPreTag;
      hlPostTag = typeof(hlPostTag) === 'undefined'? "</strong>" : hlPostTag;
      $( widget ).catcomplete({
          source: function( request, response ) {
              $.ajax({
                  url: "http://localhost:9200/states/state/_search",
                  type:"POST",		   
                  dataType: "json",
                  data: JSON.stringify({
                    "query": {
                      "query_string": {
                        "query": request.term,
                        "fields": [
                          "state"
                        ],
                        "default_operator": "AND"
                      }
                    },
                    "from": 0,
                    "size": 5,
                    "fields": [
                      "state"
                    ],
                    "highlight": {
                      "pre_tags": [
                        hlPreTag
                      ],
                      "post_tags": [
                        hlPostTag
                      ],
                      "fields": {
                        "state": {}
                      }
                    }
                  }),
                  success: function( data ) {
                      response( $.map( data.hits.hits, function( item ) {
                          return {
                              label: item.highlight.state[0],
                              value: item.fields.state,
                              category: "State"
                          }
                      }));
                  }
              });
          },
          minLength: 1,
      })
      .data( "catcomplete" )._renderItem = function( ul, item ) {
              return $( "<li></li>" )
                      .data( "item.autocomplete", item )
                      .append('<a>' +  item.label + "</a>")
                      .appendTo( ul );
      };
  }
