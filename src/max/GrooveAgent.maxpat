{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 9,
			"minor" : 0,
			"revision" : 9,
			"architecture" : "x64",
			"modernui" : 1
		}
,
		"classnamespace" : "box",
		"rect" : [ 382.0, 112.0, 858.0, 662.0 ],
		"gridsize" : [ 15.0, 15.0 ],
		"description" : "GrooveAgent - AI-Driven MIDI Style Transfer",
		"digest" : "Apply artist-inspired groove to your MIDI clips",
		"tags" : "MIDI, Groove, AI, Style Transfer",
		"boxes" : [ 			{
				"box" : 				{
					"id" : "obj-1",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"patching_rect" : [ 50.0, 50.0, 50.0, 22.0 ],
					"text" : "midiin"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-2",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 50.0, 650.0, 55.0, 22.0 ],
					"text" : "midiout"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-10",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 20.0, 20.0, 250.0, 20.0 ],
					"text" : "GrooveAgent UI Controls - Story 2.1"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-artist-input",
					"maxclass" : "live.text",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 204.0, 50.0, 300.0, 30.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 20.0, 160.0, 300.0, 30.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_enum" : [ "val1", "val2" ],
							"parameter_longname" : "Artist",
							"parameter_mmax" : 1,
							"parameter_modmode" : 0,
							"parameter_shortname" : "Artist",
							"parameter_type" : 2
						}

					}
,
					"text" : "Enter artist name...",
					"varname" : "artist"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-model-menu",
					"maxclass" : "live.menu",
					"numinlets" : 1,
					"numoutlets" : 3,
					"outlettype" : [ "", "", "float" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 205.0, 82.0, 140.0, 15.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 20.0, 200.0, 140.0, 15.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_enum" : [ "Ollama", "Claude", "OpenAI", "Groq" ],
							"parameter_initial" : [ 0 ],
							"parameter_initial_enable" : 1,
							"parameter_longname" : "Model",
							"parameter_mmax" : 3,
							"parameter_modmode" : 0,
							"parameter_shortname" : "Model",
							"parameter_type" : 2
						}

					}
,
					"varname" : "model"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-bars-menu",
					"maxclass" : "live.menu",
					"numinlets" : 1,
					"numoutlets" : 3,
					"outlettype" : [ "", "", "float" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 365.0, 82.0, 140.0, 15.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 180.0, 200.0, 140.0, 15.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_enum" : [ "1", "2", "4", "8", "16" ],
							"parameter_initial" : [ 3 ],
							"parameter_initial_enable" : 1,
							"parameter_longname" : "Bars",
							"parameter_mmax" : 4,
							"parameter_modmode" : 0,
							"parameter_shortname" : "Bars",
							"parameter_type" : 2
						}

					}
,
					"varname" : "bars"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-variations-dial",
					"maxclass" : "live.dial",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "float" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 203.0, 101.0, 59.886357426643372, 48.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 20.0, 240.0, 60.0, 48.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_initial" : [ 4 ],
							"parameter_initial_enable" : 1,
							"parameter_longname" : "Variations",
							"parameter_mmax" : 6.0,
							"parameter_mmin" : 1.0,
							"parameter_modmode" : 0,
							"parameter_shortname" : "Variations",
							"parameter_type" : 1,
							"parameter_unitstyle" : 0
						}

					}
,
					"varname" : "variations"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-intensity-dial",
					"maxclass" : "live.dial",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "float" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 265.0, 101.0, 60.0, 48.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 100.0, 240.0, 60.0, 48.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_initial" : [ 100 ],
							"parameter_initial_enable" : 1,
							"parameter_longname" : "Intensity",
							"parameter_mmax" : 200.0,
							"parameter_modmode" : 0,
							"parameter_shortname" : "Intensity",
							"parameter_type" : 1,
							"parameter_unitstyle" : 5
						}

					}
,
					"varname" : "intensity"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-apply-button",
					"maxclass" : "live.text",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 203.0, 151.0, 200.0, 40.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 20.0, 320.0, 200.0, 40.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_enum" : [ "val1", "val2" ],
							"parameter_longname" : "Apply Groove",
							"parameter_mmax" : 1,
							"parameter_modmode" : 0,
							"parameter_shortname" : "Apply",
							"parameter_type" : 2
						}

					}
,
					"text" : "Apply Groove",
					"texton" : "Apply Groove",
					"varname" : "apply"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-settings-button",
					"maxclass" : "live.text",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"parameter_enable" : 1,
					"patching_rect" : [ 425.0, 151.0, 80.0, 40.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 240.0, 320.0, 80.0, 40.0 ],
					"saved_attribute_attributes" : 					{
						"valueof" : 						{
							"parameter_enum" : [ "val1", "val2" ],
							"parameter_longname" : "Settings",
							"parameter_mmax" : 1,
							"parameter_modmode" : 0,
							"parameter_shortname" : "Settings",
							"parameter_type" : 2
						}

					}
,
					"text" : "Settings ⚙",
					"texton" : "Settings ⚙",
					"varname" : "settings"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-model-sel",
					"maxclass" : "newobj",
					"numinlets" : 5,
					"numoutlets" : 5,
					"outlettype" : [ "bang", "bang", "bang", "bang", "" ],
					"patching_rect" : [ 200.0, 260.0, 200.0, 22.0 ],
					"text" : "sel 0 1 2 3"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-model-ollama",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 200.0, 321.818191409111023, 60.0, 22.0 ],
					"text" : "ollama"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-model-claude",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 270.25, 321.818191409111023, 60.0, 22.0 ],
					"text" : "claude"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-model-openai",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 340.0, 321.818191409111023, 60.0, 22.0 ],
					"text" : "openai"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-model-groq",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 409.5, 321.818191409111023, 60.0, 22.0 ],
					"text" : "groq"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-bars-sel",
					"maxclass" : "newobj",
					"numinlets" : 6,
					"numoutlets" : 6,
					"outlettype" : [ "bang", "bang", "bang", "bang", "bang", "" ],
					"patching_rect" : [ 360.0, 260.0, 200.0, 22.0 ],
					"text" : "sel 0 1 2 3 4"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-bars-1",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 360.0, 290.0, 29.5, 22.0 ],
					"text" : "1"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-bars-2",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 400.0, 290.0, 29.5, 22.0 ],
					"text" : "2"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-bars-4",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 440.0, 290.0, 29.5, 22.0 ],
					"text" : "4"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-bars-8",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 480.0, 290.0, 29.5, 22.0 ],
					"text" : "8"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-bars-16",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 520.0, 290.0, 29.5, 22.0 ],
					"text" : "16"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-pack-params",
					"maxclass" : "newobj",
					"numinlets" : 5,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 200.0, 416.0, 300.0, 22.0 ],
					"text" : "pack s s i i i"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-format-json",
					"linecount" : 3,
					"maxclass" : "newobj",
					"numinlets" : 5,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 200.0, 440.0, 400.0, 50.0 ],
					"text" : "sprintf {\\\"cmd\\\":\\\"apply-groove\\\"\\,\\\"id\\\":\\\"req-1\\\"\\,\\\"params\\\":{\\\"artist\\\":\\\"%s\\\"\\,\\\"provider\\\":\\\"%s\\\"\\,\\\"bars\\\":%i\\,\\\"variations\\\":%i\\,\\\"intensity\\\":%i}}"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-prepend-cmd",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 200.0, 492.0, 79.0, 22.0 ],
					"text" : "prepend cmd"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-node",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"patching_rect" : [ 200.0, 520.0, 280.0, 22.0 ],
					"saved_object_attributes" : 					{
						"autostart" : 1,
						"defer" : 0,
						"watch" : 0
					}
,
					"text" : "node.script ../node/index.js @autostart 1",
					"textfile" : 					{
						"text" : "",
						"flags" : 2,
						"embed" : 1,
						"autowatch" : 0
					}

				}

			}
, 			{
				"box" : 				{
					"id" : "obj-response-route",
					"maxclass" : "newobj",
					"numinlets" : 3,
					"numoutlets" : 3,
					"outlettype" : [ "", "", "" ],
					"patching_rect" : [ 200.0, 560.0, 120.0, 22.0 ],
					"text" : "route success error"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-print",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 200.0, 600.0, 106.0, 22.0 ],
					"text" : "print GrooveAgent"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-settings-msg",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 420.0, 400.0, 227.0, 22.0 ],
					"text" : "{\\\"cmd\\\":\\\"settings\\\"\\,\\\"id\\\":\\\"req-settings\\\"}"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-settings-prepend",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 420.0, 430.0, 79.0, 22.0 ],
					"text" : "prepend cmd"
				}

			}
, 			{
				"box" : 				{
					"bgcolor" : [ 0.2, 0.2, 0.2, 1.0 ],
					"id" : "obj-display-placeholder",
					"linecount" : 3,
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 327.0, 101.0, 178.0, 48.0 ],
					"presentation" : 1,
					"presentation_linecount" : 3,
					"presentation_rect" : [ 20.0, 20.0, 178.0, 48.0 ],
					"text" : "[Display Screen]\n(Story 2.2 - jsui implementation)\nReserved: 300x120px"
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-2", 0 ],
					"source" : [ "obj-1", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-format-json", 0 ],
					"source" : [ "obj-apply-button", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 0 ],
					"source" : [ "obj-artist-input", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 2 ],
					"source" : [ "obj-bars-1", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 2 ],
					"source" : [ "obj-bars-16", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 2 ],
					"source" : [ "obj-bars-2", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 2 ],
					"source" : [ "obj-bars-4", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 2 ],
					"source" : [ "obj-bars-8", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-bars-sel", 0 ],
					"source" : [ "obj-bars-menu", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-bars-1", 0 ],
					"source" : [ "obj-bars-sel", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-bars-16", 0 ],
					"source" : [ "obj-bars-sel", 4 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-bars-2", 0 ],
					"source" : [ "obj-bars-sel", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-bars-4", 0 ],
					"source" : [ "obj-bars-sel", 2 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-bars-8", 0 ],
					"source" : [ "obj-bars-sel", 3 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-prepend-cmd", 0 ],
					"source" : [ "obj-format-json", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 4 ],
					"source" : [ "obj-intensity-dial", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 1 ],
					"source" : [ "obj-model-claude", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 1 ],
					"source" : [ "obj-model-groq", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-model-sel", 0 ],
					"source" : [ "obj-model-menu", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 1 ],
					"source" : [ "obj-model-ollama", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 1 ],
					"source" : [ "obj-model-openai", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-model-claude", 0 ],
					"source" : [ "obj-model-sel", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-model-groq", 0 ],
					"source" : [ "obj-model-sel", 3 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-model-ollama", 0 ],
					"source" : [ "obj-model-sel", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-model-openai", 0 ],
					"source" : [ "obj-model-sel", 2 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-response-route", 0 ],
					"source" : [ "obj-node", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-format-json", 0 ],
					"source" : [ "obj-pack-params", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-node", 0 ],
					"source" : [ "obj-prepend-cmd", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-print", 0 ],
					"source" : [ "obj-response-route", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-print", 0 ],
					"source" : [ "obj-response-route", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-settings-msg", 0 ],
					"source" : [ "obj-settings-button", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-settings-prepend", 0 ],
					"source" : [ "obj-settings-msg", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-node", 0 ],
					"source" : [ "obj-settings-prepend", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-pack-params", 3 ],
					"source" : [ "obj-variations-dial", 1 ]
				}

			}
 ],
		"parameters" : 		{
			"obj-apply-button" : [ "Apply Groove", "Apply", 0 ],
			"obj-artist-input" : [ "Artist", "Artist", 0 ],
			"obj-bars-menu" : [ "Bars", "Bars", 0 ],
			"obj-intensity-dial" : [ "Intensity", "Intensity", 0 ],
			"obj-model-menu" : [ "Model", "Model", 0 ],
			"obj-settings-button" : [ "Settings", "Settings", 0 ],
			"obj-variations-dial" : [ "Variations", "Variations", 0 ],
			"parameterbanks" : 			{
				"0" : 				{
					"index" : 0,
					"name" : "",
					"parameters" : [ "-", "-", "-", "-", "-", "-", "-", "-" ],
					"buttons" : [ "-", "-", "-", "-", "-", "-", "-", "-" ]
				}

			}
,
			"inherited_shortname" : 1
		}
,
		"dependency_cache" : [  ],
		"autosave" : 0,
		"oscreceiveudpport" : 0
	}

}
