sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast" // Add this line for MessageToast

], function (Controller, JSONModel, UIComponent, MessageToast) {
    "use strict";
    var controller, component;

    return Controller.extend("mindset.adt.ui5.adtui5.controller.SkillList", {
        onInit: function () {
            controller = this;
            component = this.getOwnerComponent();

            var oViewModel = new JSONModel({
                editMode: false,
                busy: true,
                delay: 0,
                selectedItemsCount: null,
                newSkill: {
                    Name: "",
                    SkillId: this.generateUUID()
                },
                Skills: [] // Initialize an empty Skills array
            });

            // Fetch existing skills from OData service
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/Employee_Skills_CRUD", {
                success: function (oData) {
                    var skills = oData.results.map(function (skill) {
                        return {
                            Name: skill.Name,
                            SkillId: skill.SkillId,
                            editMode: false // Initialize editMode to false
                        };
                    });
                    oViewModel.setProperty("/Skills", skills);
                },
                error: function (oError) {
                    // Handle error
                }
            });

            this.getView().setModel(oViewModel, "viewModel");
        },

        generateUUID: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },

        onAddSkillPress: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var aSkills = oViewModel.getProperty("/Skills");

            // Check if there's already an unsaved newSkill
            var unsavedSkillIndex = aSkills.findIndex(function (skill) {
                return skill.editMode === true;
            });

            if (unsavedSkillIndex === -1) {
                var newSkill = {
                    Name: "",
                    SkillId: "", // Generate a new UUID later during save
                    editMode: true
                };
                aSkills.push(newSkill);
                oViewModel.refresh(); // Refresh the binding to reflect the change
            }
        },



        onEditSkill: function (oEvent) {
            var oViewModel = this.getView().getModel("viewModel");
            var aSkills = oViewModel.getProperty("/Skills");

            var oListItem = oEvent.getSource().getParent().getParent(); // Adjust this based on your view structure
            var sPath = oListItem.getBindingContext("viewModel").getPath(); // Use the view model's context

            // Find the index of the edited skill in the array
            var iIndex = parseInt(sPath.split("/")[2]);

            if (iIndex >= 0 && iIndex < aSkills.length) {
                // Set the skill at the specified index in edit mode
                aSkills[iIndex].editMode = true;
                oViewModel.refresh();
            }
        },

        // onSaveSkillPress: function (oEvent) {
        //     var oViewModel = this.getView().getModel("viewModel");
        //     var aSkills = oViewModel.getProperty("/Skills");

        //     // Find the skill that is in edit mode
        //     var editedSkillIndex = aSkills.findIndex(function (skill) {
        //         return skill.editMode === true;
        //     });

        //     if (editedSkillIndex !== -1) {
        //         var editedSkill = aSkills[editedSkillIndex];

        //         // Clone the skill object and remove the editMode property
        //         var skillToSave = Object.assign({}, editedSkill);
        //         delete skillToSave.editMode;

        //         var oModel = this.getOwnerComponent().getModel();

        //         if (editedSkill.SkillId) {
        //             // If SkillId exists, perform an update
        //             oModel.update("/Employee_Skills_CRUD(guid'" + editedSkill.SkillId + "')", skillToSave, {
        //                 success: function () {
        //                     // Handle success
        //                     MessageToast.show("Skill updated successfully");
        //                     editedSkill.editMode = false; // Set back to view mode
        //                     oViewModel.refresh(); // Refresh the binding to reflect the change
        //                 },
        //                 error: function () {
        //                     // Handle error
        //                     MessageToast.show("Error, skill not updated");
        //                     editedSkill.editMode = true; // Set back to edit mode
        //                     oViewModel.refresh(); // Refresh the binding to reflect the change
        //                 }
        //             });
        //         } else {
        //             // If SkillId is not present, generate a new UUID and perform a create
        //             skillToSave.SkillId = this.generateUUID(); // Generate a new UUID
        //             oModel.create("/Employee_Skills_CRUD", skillToSave, {
        //                 success: function () {
        //                     // Handle success
        //                     MessageToast.show("Skill created successfully");
        //                     editedSkill.editMode = false; // Set back to view mode
        //                     oViewModel.refresh(); // Refresh the binding to reflect the change
        //                 },
        //                 error: function () {
        //                     // Handle error
        //                     MessageToast.show("Error, skill not created");
        //                     aSkills.splice(editedSkillIndex, 1); // Remove the unsaved skill
        //                     oViewModel.refresh(); // Refresh the binding to reflect the change
        //                 }
        //             });
        //         }
        //     }
        // },
        // onSaveSkillPress: function (oEvent) {
        //     var oViewModel = this.getView().getModel("viewModel");
        //     var aSkills = oViewModel.getProperty("/Skills");

        //     // Find the new skill that is in edit mode
        //     var newSkill = aSkills.find(function (skill) {
        //         return skill.editMode === true;
        //     });

        //     if (newSkill) {
        //         // Set back to view mode and refresh the binding
        //         newSkill.editMode = false;
        //         oViewModel.refresh();

        //         // Generate a new UUID for the skill
        //         newSkill.SkillId = this.generateUUID();

        //         // Prepare the skill object for creating by removing the editMode property
        //         var skillToCreate = Object.assign({}, newSkill); // Clone the skill object
        //         delete skillToCreate.editMode; // Remove the editMode property

        //         // Perform the POST request to create the skill
        //         var oModel = this.getOwnerComponent().getModel(); // Get the OData model
        //         oModel.create("/Employee_Skills_CRUD", skillToCreate, {
        //             success: function () {
        //                 // Handle success
        //             },
        //             error: function () {
        //                 // Handle error
        //                 sap.m.MessageToast.show("Failed to create the skill. Please try again.");
        //                 aSkills.pop(); // Remove the skill from the viewModel
        //                 oViewModel.refresh(); // Refresh the binding to reflect the change
        //             }
        //         });
        //     }
        // },

        onSaveSkillPress: function (oEvent) {
            var oViewModel = this.getView().getModel("viewModel");
            var aSkills = oViewModel.getProperty("/Skills");

            // Find the skill that is in edit mode
            var editedSkillIndex = aSkills.findIndex(function (skill) {
                return skill.editMode === true;
            });

            if (editedSkillIndex !== -1) {
                var editedSkill = aSkills[editedSkillIndex];

                // Clone the skill object and remove the editMode property
                var skillToSave = Object.assign({}, editedSkill);
                delete skillToSave.editMode;

                var oModel = this.getOwnerComponent().getModel();

                if (editedSkill.SkillId) {
                    // If SkillId exists, perform an update
                    oModel.update("/Employee_Skills_CRUD(guid'" + editedSkill.SkillId + "')", skillToSave, {
                        success: function () {
                            // Handle success
                            MessageToast.show("Skill updated successfully");
                            editedSkill.editMode = false; // Set back to view mode
                            oViewModel.refresh(); // Refresh the binding to reflect the change
                        },
                        error: function () {
                            // Handle error
                            MessageToast.show("Error, skill not updated");
                            editedSkill.editMode = true; // Set back to edit mode
                            oViewModel.refresh(); // Refresh the binding to reflect the change
                        }
                    });
                } else {
                    // If SkillId is not present, generate a new UUID and perform a create
                    skillToSave.SkillId = this.generateUUID(); // Generate a new UUID
                    oModel.create("/Employee_Skills_CRUD", skillToSave, {
                        success: function () {
                            // Handle success
                            MessageToast.show("Skill created successfully");
                            editedSkill.editMode = false; // Set back to view mode
                            oViewModel.refresh(); // Refresh the binding to reflect the change
                        },
                        error: function () {
                            // Handle error
                            MessageToast.show("Error, skill not created");
                            aSkills.splice(editedSkillIndex, 1); // Remove the unsaved skill
                            oViewModel.refresh(); // Refresh the binding to reflect the change
                        }
                    });
                }
            }
        },


        onDeleteSkill: function (oEvent) {
            var oViewModel = this.getView().getModel("viewModel");
            var aSkills = oViewModel.getProperty("/Skills");

            var oListItem = oEvent.getSource().getParent().getParent(); // Adjust this based on your view structure
            var sPath = oListItem.getBindingContext("viewModel").getPath(); // Use the view model's context

            // Find the index of the skill in the array
            var iIndex = parseInt(sPath.split("/")[2]);

            if (iIndex >= 0 && iIndex < aSkills.length) {
                // Get the skill object to delete
                var skillToDelete = aSkills[iIndex];

                // Perform the DELETE request to delete the skill
                var oModel = this.getOwnerComponent().getModel();
                oModel.remove("/Employee_Skills_CRUD(guid'" + skillToDelete.SkillId + "')", {
                    success: function () {
                        // Handle success
                        MessageToast.show("Skill deleted");
                        aSkills.splice(iIndex, 1); // Remove the skill from the array
                        oViewModel.refresh(); // Refresh the binding to reflect the change
                    },
                    error: function () {
                        // Handle error
                        MessageToast.show("Error, skill not deleted");
                        oViewModel.refresh(); // Refresh the binding to reflect the change
                    }
                });
            }
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onEmployeeListNav: function () {
            this.getRouter().navTo("EmployeeList");
        }
    });
});
