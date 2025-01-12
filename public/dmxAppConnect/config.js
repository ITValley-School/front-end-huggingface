dmx.config({
  "chat_completions": {
    "flow_chat": {
      "meta": {},
      "local": [
        {
          "name": "sc_chat",
          "type": "object",
          "metaData": {
            "_get_inp_fld_0generated_text": {
              "meta": null,
              "outputType": "text"
            }
          }
        }
      ]
    }
  },
  "image_generate": {
    "flow_image": {
      "meta": {},
      "local": [
        {
          "name": "sc_image_generate",
          "type": "object",
          "metaData": {
            "_get_inp_fld_0prompt": {
              "meta": null,
              "outputType": "text"
            }
          }
        }
      ]
    }
  },
  "chat02": {
    "flow_chat": {
      "meta": {},
      "local": [
        {
          "name": "sc_chat",
          "type": "object",
          "metaData": {
            "_get_inp_fld_0prompt_chat": {
              "meta": null,
              "outputType": "text"
            }
          }
        }
      ]
    },
    "api1": [
      {
        "type": "array",
        "name": "data",
        "sub": [
          {
            "type": "text",
            "name": "generated_text"
          }
        ]
      },
      {
        "type": "object",
        "name": "headers",
        "sub": [
          {
            "type": "text",
            "name": "content-length"
          },
          {
            "type": "text",
            "name": "content-type"
          },
          {
            "type": "text",
            "name": "date"
          },
          {
            "type": "text",
            "name": "server"
          }
        ]
      }
    ],
    "api": [
      {
        "type": "array",
        "name": "data",
        "sub": [
          {
            "type": "text",
            "name": "generated_text"
          }
        ]
      },
      {
        "type": "object",
        "name": "headers",
        "sub": [
          {
            "type": "text",
            "name": "content-length"
          },
          {
            "type": "text",
            "name": "content-type"
          },
          {
            "type": "text",
            "name": "date"
          },
          {
            "type": "text",
            "name": "server"
          }
        ]
      }
    ]
  }
});
