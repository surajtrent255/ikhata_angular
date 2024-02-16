$(function () {
  //TODO: need to take this from user configuration.

  var totalRecordsPerPage = 10;
  var customerRecordsPerPage = parseInt(
    $(".customerPaginationData span.endIndex").text()
  );
  var adjustmentRecordsPerPage = parseInt(
    $(".adjustmentPaginationData span.endIndex").text()
  );
  var productRecordsPerPage = parseInt(
    $(".productPaginationData span.endIndex").text()
  );
  var pricingTypeRecordsPerPage = parseInt(
    $(".pricingTypePaginationData span.endIndex").text()
  );
  var pricingSeqRecordsPerPage = parseInt(
    $(".pricingSeqPaginationData span.endIndex").text()
  );
  var groupComboRecordsPerPage = parseInt(
    $(".groupComboPaginationData span.endIndex").text()
  );
  var prodAttrRecordsPerPage = parseInt(
    $(".productAttrPaginationData span.endIndex").text()
  );
  var custAttrRecordsPerPage = parseInt(
    $(".customerAttrPaginationData span.endIndex").text()
  );
  var initialLoadHierarchy = 1;
  var orgGroupType = 1;
  var productGroupType = 2;
  var nonInitialLazyLoad = 2;
  var rootNode = -1;
  var customerPerPageRecords = "CUSTOMER_RECORDS_PER_PAGE";
  var adjustmentPerPageRecords = "ADJUSTMENT_RECORDS_PER_PAGE";
  var alphaNumericsOnly = "^[a-zA-Z0-9_]*$";
  var productPerPageRecords = "PRODUCT_RECORDS_PER_PAGE";
  var adjustmentAdvSearchParams;
  var customerAdvSearchParams;
  var productAdvSearchParams;
  var showTblIdTreeCheck = "unchecked";
  var pricingTypePerPageRecords = "PRICING_TYPE_RECORDS_PER_PAGE";
  var pricingSeqPerPageRecords = "PRICING_SEQ_RECORDS_PER_PAGE";
  var groupComboPerPageRecords = "GROUP_COMBO_RECORDS_PER_PAGE";
  var prodAttrPerPageRecords = "PROD_ATTR_RECORDS_PER_PAGE";
  var custAttrPerPageRecords = "CUST_ATTR_RECORDS_PER_PAGE";
  var showTblIdTreeCheck = "unchecked";
  var quoteGenerateTime;
  //Header name of choose column popup
  var chooseColCustomer = "Choose Columns- Customer Table";
  var chooseColProduct = "Choose Columns- Product Table";
  var chooseColAdjustment = "Choose Columns- Adjustment Table";

  /*---- FOLDER structure JSTREE ----- */
  /*--- Draggable Groups --- */
  createGroupTree(
    "#organizationHierarchy",
    orgGroupType,
    ".jstree-drop-org",
    "/groups/organization/edit"
  );
  createGroupTree(
    "#productHierarchy",
    productGroupType,
    ".jstree-drop-product",
    "/groups/product/edit"
  );

  function createGroupTree(groupTreeId, groupType, dropTarget, editUrl) {
    $(groupTreeId)
      .jstree({
        json_data: {
          ajax: {
            type: "GET",
            url: function (node) {
              if (node == rootNode) {
                temp_node = node;
                return (
                  "/groups/hierarchies/display?type=" +
                  groupType +
                  "&level=" +
                  initialLoadHierarchy +
                  "&rand=" +
                  new Date().getTime()
                );
              } else {
                temp_node = 0;
                return (
                  "/groups/hierarchies/display?unid=" +
                  node.attr("unid") +
                  "&type=" +
                  groupType +
                  "&level=" +
                  nonInitialLazyLoad +
                  "&rand=" +
                  new Date().getTime()
                );
              }
            },
            success: function (hierarchy) {
              if (temp_node == rootNode) {
                return hierarchy.hierarchy.node[0];
              } else {
                var data = [];
                $.each(
                  hierarchy.hierarchy.hierarchies,
                  function (iterator, group) {
                    var state = group.hasChildren == 0 ? "leaf" : "closed";
                    data.push({
                      data: group.name,
                      attr: {
                        id: group.id,
                        unid: group.unid,
                        parentId: group.parentId,
                        startDate: group.startDate,
                        endDate: group.endDate,
                        nameOnly: group.nameOnly,
                      },
                      state: state,
                    });
                  }
                );
                return data;
              }
            },
          },
        },
        dnd: {
          drop_finish: function (data) {
            if (data.r.attr("unid").search(data.o.attr("unid")) != -1) {
              popAlert("Group already exists.");
              return false;
            }
            str = data.r.val();
            if (
              str != "" &&
              str.charAt(str.length - 1) != "," &&
              str.charAt(str.length - 1) != " "
            ) {
              data.r.val(str + ", ");
            }
            data.r.val(data.r.val().trim() + data.o.attr("nameonly") + ", ");
            if (data.r.hasClass("customer-id-drop")) {
              data.r.val(data.o.attr("unid"));
              data.r
                .parents("tr")
                .siblings(".customer-name-field-row")
                .children(".customer-name")
                .text(data.o.attr("nameonly"));
            }
            if (data.r.attr("unid") != "") {
              data.r.attr(
                "unid",
                data.r.attr("unid") + ":" + data.o.attr("unid")
              );
            } else {
              data.r.attr("unid", data.o.attr("unid"));
            }
            if (data.r.hasClass("tokenInputText")) {
              var addedToken =
                "<li itemId='" +
                data.o.attr("unid") +
                "'>" +
                data.o.attr("nameonly") +
                " <a href='#' class='deleteToken'><img src='resources/images/deleteInputToken.png'/></a></li>";
              data.r.siblings("ul").append(addedToken);
            }
            if (data.r.hasClass("groupComboTypeDivWrapper")) {
              var dataUnid = data.o.attr("unid");
              if ($("#groupComboTypeTable tbody tr#" + dataUnid).length == 0) {
                //FIXME: Use javascript to add the element instead of writing the html manually
                var typeRow =
                  "<tr id=" +
                  data.o.attr("unid") +
                  "><td class='colAttr organizationId'>" +
                  data.o.attr("nameonly") +
                  "</td><td>" +
                  "<select id ='groupComboModifier" +
                  data.o.attr("unid") +
                  "' class='inputText groupComboModifierSelect'>" +
                  "<option class='gands' value='1'>Groups &nbsp; Subgroups</option>" +
                  "<option class='groups' value='2'>Groups only</option>" +
                  "<option class='subgroups' value='3'>subGroups only</option></select></td></tr>";

                $("#groupComboTypeTable tbody").append(typeRow);
              }
            }
            //Display the Orgname without unid in create customer form
            if (data.r.hasClass("custAdvSrcGrpName")) {
              $("#custAdvanceSearch input#custAdvSrcGrpId").val(
                $("#custAdvanceSearch input#custAdvSrcGrpId").val() +
                  "," +
                  data.o.attr("unid")
              );
            }

            if (data.r.hasClass("proSrcProductGrpTxt")) {
              $("#proSrcProductGrp").val(
                $("#proSrcProductGrp").val() + "," + data.o.attr("unid")
              );
            } else if (data.r.hasClass("adjSerProdGrpIdTxt")) {
              $("#adjSerProdGrpId").val(
                $("#adjSerProdGrpId").val() + "," + data.o.attr("unid")
              );
            }

            if (data.r.hasClass("proSrcCustId")) {
              $("#prodAdvanceSearch input#proSrcCustId").val(
                data.o.attr("unid")
              );
              $("#proSrcCustName").text(data.o.attr("nameonly"));
            }
            if (data.r.hasClass("adjSerOrgIdTxt")) {
              $("#adjSerOrgId").val(
                $("#adjSerOrgId").val() + "," + data.o.attr("unid")
              );
            }
            if (data.r.hasClass("customerTableDataLayout")) {
              //var url="/customers/adv-search";

              var startIndex = parseInt(
                $(".customerPaginationData span.startIndex").text()
              );
              var endIndex = parseInt(
                $(".customerPaginationData span.endIndex").text()
              );
              var totalRecords = endIndex - startIndex + 1;
              var params = {
                custGrpId: data.o.attr("unid"),
                startIndex: startIndex,
                endIndex: endIndex,
                totalRecords: totalRecords,
              };
              loadCustomerAdvanceSearchData(params);
            }
          },
          drop_target: dropTarget,
        },
        plugins: ["themes", "ui", "dnd", "json_data", "crrm"],
        core: { load_open: true },
        themes: { theme: "apple" },
        // each plugin you have included can have its own config object
        // "core" : { "initially_open" : [ "1" ] }
        // it makes sense to configure a plugin only if overriding the defaults
      })
      .on("move_node.jstree", function (event, data) {
        var moveParams;
        var refNode;
        data.rslt.o.addClass("jstree-draggable");
        data.rslt.r.addClass("jstreeDrop");
        moveParams = {
          startDate: data.rslt.o.attr("startdate"),
          endDate: data.rslt.o.attr("enddate"),
          groupName: $(".jstree-draggable").text().substr(2),
          unid: data.rslt.o.attr("unid"),
          id: data.rslt.o.attr("id"),
          parentId: data.rslt.r.attr("unid"),
          isCopy: false,
        };
        refNode = $(".jstreeDrop");
        $.jstree._reference($(groupTreeId)).cut($(".jstree-draggable"));
        jQuery.ajax({
          type: "POST",
          url: editUrl,
          data: moveParams,
          dataType: "json",
          success: function (str) {
            $.jstree._reference($(groupTreeId)).paste(refNode);
            $.jstree._reference($(groupTreeId)).refresh(refNode);
            data.rslt.o.removeClass("jstree-draggable");
            data.rslt.r.removeClass("jstreeDrop");
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            // TODO: need to show error message form the Server
          },
        });
        moveParams = undefined;
      });
  }
  /*---- Hierachy Popups and script -- */
  $("#organizationHierarchy ul li a").live("click", function (e) {
    e.stopPropagation();
    $("#productHierarchy ul a.jstree-clicked").removeClass("jstree-clicked");
  });
  $("#productHierarchy ul li a").live("click", function (e) {
    e.stopPropagation();
    $("#organizationHierarchy ul a.jstree-clicked").removeClass(
      "jstree-clicked"
    );
  });
  $(".addChildInHierachlyLink").live("click", function () {
    if ($(".hierarchyContainer .jstree-clicked").length == 0) {
      popAlert("Please select an organization or a product group.");
      return false;
    }
    $("#addChildGroup span.validationMsg").hide();
    $("#addChildGroup")[0].reset();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#addChildInHierarchyPopup").fadeIn("fast");
    var name = $(".jstree-clicked").text();
    $("span.childTo").text(name);
    $("#addChild input#startDate").val($("#defStartDate").text());
    $("#addChild input#endDate").val($("#defEndDate").text());
    return false;
  });
  $(".addSiblingInHierarchyLink").live("click", function () {
    if ($(".hierarchyContainer .jstree-clicked").length == 0) {
      popAlert("Please select an organization or a product group.");
      return false;
    }
    if ($(".hierarachy-Div>ul>li>a").hasClass("jstree-clicked")) {
      popAlert("You cannot add a sibling to the root group.");
      return false;
    }
    $("#addSiblingGroup span.validationMsg").hide();
    $("#addSiblingGroup")[0].reset();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#addSiblingInHierarchyPopup").fadeIn("fast");
    var name = $(".jstree-clicked").text();
    $("span.siblingTo").text(name);
    $("#addSibling input#siblingStartDate").val($("#defStartDate").text());
    $("#addSibling input#siblingEndDate").val($("#defEndDate").text());
    return false;
  });
  $(".editNodeInHierarchyLink").live("click", function () {
    if ($(".hierarchyContainer .jstree-clicked").length == 0) {
      popAlert("Please select an organization or a product group.");
      return false;
    }
    $("#editGroups span.validationMsg").hide();
    $("#editGroups")[0].reset();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#editNodeInHierarchyPopup").fadeIn("fast");
    return false;
  });
  $("#deleteNode").live("click", function () {
    if ($(".hierarchyContainer .jstree-clicked").length == 0) {
      popAlert("Please select an organization or a product group.");
      return false;
    }
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#deleteNodeInHierarchyPopup").fadeIn("fast");
    var name = $(".jstree-clicked").text();
    $("span.deleteHirNode").text(name);
    return false;
  });

  $(".deletePricingSequence").live("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#deletePricingSequence").fadeIn("fast");
    var name = $(this).parents().siblings(".pricing-seq-desc").html();
    $("span.deletePricingSeq").text(name);
    var unid = $(this).parents().siblings().children("#sequenceUnid").html();
    $("span#pricingSequenceUnid").text(unid);
    return false;
  });

  $(".deletePricingType").live("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#deletePricingType").fadeIn("fast");
    var name = $(this).parent().siblings(".pricingTypeDescription").html();
    $("span#delPricingTypeName").text(name);
    var unid = $(this).parent().siblings().html();
    $("span#pricingTypeUnid").text(unid);
    return false;
  });

  $(".deleteCustomerAttribute").live("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#deleteCustomerAttribute").fadeIn("fast");
    var name = $(this).parent().siblings(".customerAttributeName").html();
    $("span#customerAttributeName").text(name);
    var unid = $(this).parent().siblings().html();
    $("span#attributeUnid").text(unid);
    return false;
  });

  $(".deleteProductAttribute").live("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#deleteProductAttribute").fadeIn("fast");
    var name = $(this).parent().siblings(".productAttributeName").html();
    $("span#productAttributeName").text(name);
    var unid = $(this).parent().siblings().html();
    $("span#productAttributeUnid").text(unid);
    return false;
  });

  $(".deleteGroupCombo").live("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#deleteGroupCombo").fadeIn("fast");
    var name = $(this).parent().siblings(".groupComboDescription").html();
    $("span#groupComboName").text(name);
    var unid = $(this).parent().siblings(".groupComboUnid").html();
    $("span#gComboUnid").text(unid);
    return false;
  });
  var cutCopyParams;
  /*** cut hierarchy node ***/
  $("#cutNode").live("click", function () {
    $(".selectedCutNode").removeClass("selectedCutNode");
    if ($(".hierarchyContainer .jstree-clicked").length == 0) {
      popAlert("Please select an organization or a product group.");
      return false;
    }
    if ($(".hierarachy-Div>ul>li>a").hasClass("jstree-clicked")) {
      popAlert("You cant cut a node that has no parent or sibling.");
      return false;
    }
    cutCopyParams = {
      startDate: $(".jstree-clicked").parent().attr("startdate"),
      endDate: $(".jstree-clicked").parent().attr("enddate"),
      groupName: $(".jstree-clicked").text().substr(1),
      unid: $(".jstree-clicked").parent().attr("unid"),
      id: $(".jstree-clicked").parent().attr("id"),
      parentId: "",
      type: "",
      isCopy: false,
    };
    $(".jstree-clicked").addClass("selectedCutNode");
    if (
      $(".jstree-clicked").parents(".hierarchyContainer").attr("id") ==
      "organizationContainer"
    ) {
      $.jstree
        ._reference($("#organizationHierarchy"))
        .cut($(".jstree-clicked"));
      cutCopyParams.type = "organization";
    } else {
      $.jstree._reference($("#productHierarchy")).cut($(".jstree-clicked"));
      cutCopyParams.type = "product";
    }
  });
  /*** Copy Node ***/
  $("#copyNode").live("click", function () {
    if ($(".hierarchyContainer .jstree-clicked").length == 0) {
      popAlert("Please select an organization or a product group.");
      return false;
    }
    cutCopyParams = {
      startDate: $(".jstree-clicked").parent().attr("startdate"),
      endDate: $(".jstree-clicked").parent().attr("enddate"),
      groupName: $(".jstree-clicked").text().substr(1),
      unid: "",
      parentId: "",
      type: "",
      isCopy: true,
    };
    if (
      $(".jstree-clicked").parents(".hierarchyContainer").attr("id") ==
      "organizationContainer"
    ) {
      $.jstree
        ._reference($("#organizationHierarchy"))
        .cut($(".jstree-clicked"));
      cutCopyParams.type = "organization";
    } else {
      $.jstree._reference($("#productHierarchy")).cut($(".jstree-clicked"));
      cutCopyParams.type = "product";
    }
  });
  /*** Open pop up for Paste ***/
  $("#pasteNode").live("click", function () {
    $("#nodePaste").parent().siblings(".validationMsg").hide();
    if (typeof cutCopyParams === "undefined") {
      popAlert("Please cut/copy the group.");
      return false;
    }
    if ($(".hierarchyContainer .jstree-clicked").length == 0) {
      popAlert("Please select an organization or a product group.");
      return false;
    }
    if (
      $(".jstree-clicked").parents(".hierarchyContainer").attr("id") ==
        "organizationContainer" &&
      cutCopyParams.type == "product"
    ) {
      popAlert("Product cant be pasted in organizations.");
      return false;
    }
    if (
      $(".jstree-clicked").parents(".hierarchyContainer").attr("id") ==
        "productContainer" &&
      cutCopyParams.type == "organization"
    ) {
      popAlert("Organization cant be pasted in products.");
      return false;
    }
    if (cutCopyParams.isCopy == true) {
      $("#chooseOptionForPaste table#forUnid").show();
    }
    if (cutCopyParams.isCopy == false) {
      $("#chooseOptionForPaste table#forUnid").hide();
    }
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#choosePasteOption").fadeIn("fast");
    return false;
  });
  /*** Paste the Node At referred Node ***/
  $("#nodePaste").live("click", function () {
    var refNode;
    var data = $(".jstree-clicked").parents(".hierarchyContainer").attr("id");
    if (
      $("#chooseOptionForPaste input#addAsSibling").is(":checked") &&
      $(".hierarachy-Div>ul>li>a").hasClass("jstree-clicked")
    ) {
      $("#nodePaste").parent().siblings(".siblingCheck").show();
      return true;
    }
    if (
      !$("#chooseOptionForPaste input#addAsSibling").is(":checked") &&
      !$("#chooseOptionForPaste input#addAsChild").is(":checked")
    ) {
      $("#chooseOptionForPaste span.optionCheck").show();
      return false;
    }
    if ($("#chooseOptionForPaste input#addAsSibling").is(":checked")) {
      refNode = $(
        'li[unid="' + $(".jstree-clicked").parents().attr("parentId") + '"]'
      );
      cutCopyParams.parentId = $(".jstree-clicked").parent().attr("parentid");
    }
    if ($("#chooseOptionForPaste input#addAsChild").is(":checked")) {
      refNode = $(".jstree-clicked");
      cutCopyParams.parentId = $(".jstree-clicked").parent().attr("unid");
    }
    if (cutCopyParams.isCopy == false) {
      var url = "/groups/organization/edit";
      if (data == "organizationContainer") {
        url = "/groups/organization/edit";
      } else {
        url = "/groups/product/edit";
      }
      jQuery.ajax({
        type: "POST",
        url: url,
        data: cutCopyParams,
        dataType: "json",
        success: function (str) {
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          if (data == "organizationContainer") {
            $.jstree._reference($("#organizationHierarchy")).paste(refNode);
          }
          if (data == "productContainer") {
            $.jstree._reference($("#productHierarchy")).paste(refNode);
          }
          $(".selectedCutNode").removeClass("selectedCutNode");
        },
      });
    }
    if (cutCopyParams.isCopy == true) {
      var url;
      if (
        $("#chooseOptionForPaste input#addAsSibling").is(":checked") &&
        data == "organizationContainer"
      ) {
        url = "/groups/organization/add-sibling";
        cutCopyParams.unid = $("#chooseOptionForPaste input#unid").val();
      }
      if (
        $("#chooseOptionForPaste input#addAsSibling").is(":checked") &&
        data == "productContainer"
      ) {
        url = "/groups/product/add-sibling";
        cutCopyParams.unid = $("#chooseOptionForPaste input#unid").val();
      }
      if (
        $("#chooseOptionForPaste input#addAsChild").is(":checked") &&
        data == "organizationContainer"
      ) {
        url = "/groups/organization/add-child";
        cutCopyParams.unid = $("#chooseOptionForPaste input#unid").val();
      }
      if (
        $("#chooseOptionForPaste input#addAsChild").is(":checked") &&
        data == "productContainer"
      ) {
        url = "/groups/product/add-child";
        cutCopyParams.unid = $("#chooseOptionForPaste input#unid").val();
      }
      jQuery.ajax({
        type: "POST",
        url: url,
        data: cutCopyParams,
        dataType: "json",
        success: function (str) {
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          var data = $(".jstree-clicked")
            .parents(".hierarchyContainer")
            .attr("id");
          if (data == "organizationContainer") {
            $.jstree._reference($("#organizationHierarchy")).refresh(refNode);
          } else {
            $.jstree._reference($("#productHierarchy")).refresh(refNode);
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message form the Server
        },
      });
    }
    $("#chooseOptionForPaste")[0].reset();
    cutCopyParams = undefined;
  });

  $(".editGroupCombo").live("click", function () {
    $("#groupComboTypeTable tbody").empty();
    $(".validationMsg").hide();
    $("#editGroupComboForm")[0].reset();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $("#editGroupCombo").fadeIn("fast");
    var name = $(this).parent().siblings(".groupComboDescription").html();
    $("input#groupComboName").val(name);
    var unid = $(this).parent().siblings(".groupComboUnid").html();
    $("td#gComboUnid").text(unid);
    $("#editGroupComboForm textarea#commentText").val(
      $(this).parent().siblings(".groupComboCommentText").html()
    );
    $("#editGroupComboForm input#addGenCustProduct").removeAttr("checked");
    var type = $(this).parent().siblings(".groupComboType").html();
    if (type == 1) {
      $("#editGroupComboForm input#groupComboEditOrganization").attr(
        "checked",
        "checked"
      );
      $("#editGroupComboForm div.groupComboTypeDivWrapper").addClass(
        "jstree-drop-org"
      );
      $("#editGroupComboForm div.groupComboTypeDivWrapper").removeClass(
        "jstree-drop-product"
      );
    } else {
      $("#editGroupComboForm input#groupComboEditProduct").attr(
        "checked",
        "checked"
      );
      $("#editGroupComboForm div.groupComboTypeDivWrapper").addClass(
        "jstree-drop-product"
      );
      $("#editGroupComboForm div.groupComboTypeDivWrapper").removeClass(
        "jstree-drop-org"
      );
    }
    var groupid = {
      groupIds: $(this).parent().siblings(".groupComboIds").html(),
    };
    var sequence = $(this).parent().siblings(".groupComboSequence").html();
    $("input#groupComboPriority").val(sequence);
    jQuery.ajax({
      type: "GET",
      url: "/group-combo/get-names-by-unid",
      data: groupid,
      dataType: "json",
      success: function (str) {
        var i = 0;
        $(str.groupComboInfoRes.groupComboInformation).each(function () {
          var name = str.groupComboInfoRes.groupComboInformation[i].name;
          var unid = str.groupComboInfoRes.groupComboInformation[i].unid;
          if (name == "GENERIC_CHECKED") {
            $("#editGroupComboForm input#addGenCustProduct").attr(
              "checked",
              "checked"
            );
          } else {
            var temp = unid;
            if (unid.indexOf("+") >= 0 || unid.indexOf("-") >= 0) {
              unid = unid.substring(0, unid.length - 1);
            }
            var typeRow =
              "<tr id=" +
              unid +
              "><td class='colAttr organizationId'>" +
              name +
              "</td><td>" +
              "<select id ='groupComboModifier" +
              unid +
              "' class='inputText groupComboModifierSelect" +
              unid +
              "'>" +
              "<option class='gands" +
              unid +
              "' value='1'>Groups &nbsp; Subgroups</option>" +
              "<option class='groups" +
              unid +
              "' value='2'>Groups only</option>" +
              "<option class='subgroups" +
              unid +
              "' value='3'>subGroups only</option></select></td></tr>";
            $("#groupComboTypeTable tbody").append(typeRow);

            temp = temp.substring(temp.length - 1, temp.length);
            if (temp == "+") {
              $(".organizationId")
                .siblings()
                .children(".groupComboModifierSelect" + unid)
                .val("1");
              //$('.organizationId').siblings().children('.groupComboModifierSelect'+unid).children('.gands'+unid).attr('selected',true);
            } else if (temp == "-") {
              $(".organizationId")
                .siblings()
                .children(".groupComboModifierSelect" + unid)
                .val("3");
              //$('.organizationId').siblings().children('.groupComboModifierSelect'+unid).children('.subgroups'+unid).attr('selected',true);
            } else {
              $(".organizationId")
                .siblings()
                .children(".groupComboModifierSelect" + unid)
                .val("2");
              //$('.organizationId').siblings().children('.groupComboModifierSelect'+unid).children('.groups'+unid).attr('selected',true);
            }
          }
          i = i + 1;
        });
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("error.");
      },
    });

    return false;
  });

  /*----- For Popup close (register save close button )    ----- */

  $(".saveButton ").live("click", function () {
    $(".pageOverlay").fadeOut("fast");
    $(".PopupCloser").fadeOut("fast");
    $(".movable").removeClass("movable");
    return false;
  });

  $(".JoshiCloseButton ").live('click', function () {
    $(".pageOverlay").fadeOut("fast");
    $(".PopupCloser").fadeOut("fast");
    $(".movable").removeClass("movable");
    return false;
  });

  $(".CreateNewCompanyCloseButton ").live('click', function () {
    $(".pageOverlay").fadeOut("fast");
    $(".CreateNewCompanypopupWrapper").fadeOut("fast");
    $(".movable").removeClass("movable");
    return false;
  });

  $(".closeButton, .cancel_btn").live("click", function () {
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
    $(".movable").removeClass("movable");
    return false;
  });

  $(".Customer1CloseButton").live("click", function () {
    $(".pageOverlay").fadeOut("fast");
    $(".CustomerPopupWrapper1").fadeOut("fast");
    $(".movable").removeClass("movable");
    return false;
  });
  $(".Customer1EditCloseButton").live("click", function () {
    $(".pageOverlay").fadeOut("fast");
    $(".CustomerEditPopupWrapper").fadeOut("fast");
    $(".movable").removeClass("movable");
    return false;
  });
  $(".createCustomerCloseBtn").live("click", function () {
    $(".pageOverlay").fadeOut("fast");
    $(".createCustomerPopUpWrapper").fadeOut("fast");
    $(".movable").removeClass("movable");
    return false;
  });

  $(".closeAlertPopperButton").live("click", function () {
    $(".pageOverlay").fadeOut("fast");
    $(".popperAlert").fadeOut("fast");
    $(".movable").removeClass("movable");
    return false;
  });

  $(".registerButton ").live("click", function () {
    $(".pageOverlay").fadeOut("fast");
    $(".PopupCloser").fadeOut("fast");
    $(".movable").removeClass("movable");
    return false;
  });

  $(".MainPageCloseButton ").live("click", function () {
    $(".pageOverlay").fadeOut("fast");
    $(".MainPopupCloser").fadeOut("fast");
    $(".movable").removeClass("movable");
    return false;
  });

  $(document).bind("keydown", function (e) {
    if (e.which == 27) {
      $(".pageOverlay").fadeOut("fast");
      $(".popupWrapper").fadeOut("fast");
      $(".configTableDropdown, .helpDropdown, .allFiltersList").hide();
      $(".movable").removeClass("movable");
    }
  });
  $(".deleteRowLink").live("click", function () {
    var parentId = $(this).parents(".recordsTable").attr("id");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    var tagId = $(this).closest("tr").attr("id");
    $("#" + parentId + "DeletePopup").fadeIn("fast");
    prefillDeleteUnid(tagId);
    return false;
  });

  /*--- View Tab Script --*/
  $("#viewTabOptions li input").live("change", function () {
    if ($(this).is(":checked")) {
      var tabToShow = $(this).attr("tabView");
      if (tabToShow == "hierarchyTab") {
        $(".hierarchyWrapper").show();
      } else {
        $(".recordCategoryListWrapper .tabList li." + tabToShow).show();
      }
    } else {
      var tabToShow = $(this).attr("tabView");
      if (tabToShow == "hierarchyTab") {
        $(".hierarchyWrapper").hide();
      } else {
        $(".recordCategoryListWrapper .tabList li." + tabToShow).hide();
        updateUrl();
      }
    }
  });

  $(".removeTabLink").live("click", function () {
    $(this).parents("li").hide();
    var selId = $(this).parents("li").attr("id");
    if (selId == "masterData") {
      addLayoutConfiguration("none", "VIEW_TAB_MASTER_DATA");
      $("#masterDataVisual").attr("checked", false);
    } else if (selId == "pricingTypesAndSequences") {
      addLayoutConfiguration("none", "VIEW_TAB_PRICING_TYPES_N_SEQ");
      $("#pricingTypeVisual").attr("checked", false);
    } else if (selId == "groupComboAndAttributes") {
      addLayoutConfiguration("none", "VIEW_TAB_GROUP_COMBO");
      $("#groupComboVisual").attr("checked", false);
    } else if (selId == "testing") {
      addLayoutConfiguration("none", "VIEW_TAB_TESTING");
      $("#testingVisual").attr("checked", false);
    } else if (selId == "hierarchy") {
      $(".hierarchyWrapper").hide();
      addLayoutConfiguration("none", "VIEW_TAB_HIERARCHIES");
      $("#hierarchyVisual").attr("checked", false);
    }
    updateUrl();
    return false;
  });

  /*---- header Settings Popups Script --*/
  $("#configurationLink").live("click", function () {
    $("#configurationSettingPopup").fadeIn("fast");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    showTblIdTreeCheck = $("#defaultConfigurationData")
      .children("#showTableIdTreeCheckDefault")
      .text();
    if (showTblIdTreeCheck == "checked") {
      $("#showTableIdTreeCheck").attr("checked", showTblIdTreeCheck);
    } else {
      $("#showTableIdTreeCheck").removeAttr("checked");
    }
    if (
      $("#defaultConfigurationData")
        .children("#showTableIdDialogCheckDefault")
        .text() == "checked"
    ) {
      $("#showTableIdDialogCheck").attr("checked", "checked");
    } else {
      $("#showTableIdDialogCheck").removeAttr();
    }
    $("#effDateFrom").val(
      $("#defaultConfigurationData").children("#effDateFromDefault").text()
    );
    $("#effDateTo").val(
      $("#defaultConfigurationData").children("#effDateToDefault").text()
    );
    if (
      $("#defaultConfigurationData")
        .children("#getProductsMasterNameCheckDefault")
        .text() == "checked"
    ) {
      $("#getProductsMasterNameCheck").attr("checked", "checked");
    } else {
      $("#getProductsMasterNameCheck").removeAttr();
    }

    return false;
  });

  $("#popperAlertLink").live("click", function () {
    $("#popperAlertSettingPopup").fadeIn("fast");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    showTblIdTreeCheck = $("#defaultConfigurationData")
      .children("#showTableIdTreeCheckDefault")
      .text();
    if (showTblIdTreeCheck == "checked") {
      $("#showTableIdTreeCheck").attr("checked", showTblIdTreeCheck);
    } else {
      $("#showTableIdTreeCheck").removeAttr("checked");
    }
    if (
      $("#defaultConfigurationData")
        .children("#showTableIdDialogCheckDefault")
        .text() == "checked"
    ) {
      $("#showTableIdDialogCheck").attr("checked", "checked");
    } else {
      $("#showTableIdDialogCheck").removeAttr();
    }
    $("#effDateFrom").val(
      $("#defaultConfigurationData").children("#effDateFromDefault").text()
    );
    $("#effDateTo").val(
      $("#defaultConfigurationData").children("#effDateToDefault").text()
    );
    if (
      $("#defaultConfigurationData")
        .children("#getProductsMasterNameCheckDefault")
        .text() == "checked"
    ) {
      $("#getProductsMasterNameCheck").attr("checked", "checked");
    } else {
      $("#getProductsMasterNameCheck").removeAttr();
    }

    return false;
  });

  $("#pricingPreferencesLink").live("click", function () {
    $("#pricingPreferencePopup").fadeIn("fast");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    return false;
  });
  $("#administratorLink").live("click", function () {
    $("#administratorPopup").fadeIn("fast");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    return false;
  });
  $("#reportsLink").live("click", function () {
    $("#reportsPopup").fadeIn("fast");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    return false;
  });
  $("#helpLink").live("click", function () {
    $(this).siblings("#helpDropDownList").toggle();
    return false;
  });
  $("#viewTabLink").live("click", function () {
    $(this).siblings("#viewTabOptions").toggle();
    return false;
  });

  function prefillDeleteUnid(tagId) {
    var tags = tagId.split("_");
    var unid = tags[1];
    $("#delete-" + tags[0]).text(unid);
  }

  $(".editRowLink").live("click", function () {
    var parentId = $(this).parents(".recordsTable").attr("id");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    //$('.pageOverlay').fadeIn('fast');
    $("#" + parentId + "EditPopup").fadeIn("fast");
    var tagId = $(this).closest("tr").attr("id");
    prepopulateData(parentId + "EditPopup", tagId);
    return false;
  });

  function prepopulateData(popupId, tagId) {
    if (popupId == "adjustmentsRecordsTableEditPopup") {
      prepopulateAdjustmentData(popupId, tagId);
    }
    if (popupId == "productsRecordsTableEditPopup") {
      if ($("#val_newproductattr").children().length == 0) {
        popProductAttributes("edit", popupId, tagId);
      } else {
        prepopulateProductData(popupId, tagId);
      }
    }
    if (popupId == "customerRecordsTableEditPopup") {
      $("#editCustomer input.custGroupName").attr("unid", "");
      $("#editCustomer ul.tokenList").empty();
      if ($("#val_newcustomerattr").children().length == 0) {
        popCustomerAttributes("edit", popupId, tagId);
      } else {
        prepopulateCustomerData(popupId, tagId);
      }
    }
    if (popupId == "pricingTypesRecordsTableEditPopup") {
      prePopulatePricingTypeData(popupId, tagId);
    }
  }

  function prepopulateCustomerData(popupId, tagId) {
    $("#editCustomer span.validationMsg").hide();
    $("#editCustomer input.custGroupName").attr("unid", "");
    $("#editCustomer ul.tokenList").html("");
    $("#val_" + tagId)
      .children("span")
      .each(function () {
        if ($(this).attr("class") == "custId") {
          $("#" + popupId + " span." + $(this).attr("class")).text(
            $(this).text()
          );
        } else if ($(this).attr("class") == "custGroupId") {
          $("#" + popupId + " ." + $(this).attr("class")).attr(
            "unid",
            $(this).text()
          );
          var li = $("<li>")
            .attr("itemid", $(this).text())
            .text($("#" + tagId + " .customerOrganizationName").text());
          var an = $("<a>")
            .attr("href", "")
            .addClass("deleteToken")
            .append(
              $("<img>").attr("src", "resources/images/deleteInputToken.png")
            );
          li.append(an);
          $("#editCustomer ul.tokenList").append(li);
        } else {
          $("#" + popupId + " ." + $(this).attr("class")).val($(this).text());
        }
      });
    populateAttributes(popupId, tagId, "custAttributes", "newcustomerattr");
  }
  function popCustomerAttributes(actionType, popupId, tagId) {
    jQuery.ajax({
      type: "GET",
      url: "/customer-attribute/get-all",
      dataType: "json",
      success: function (str) {
        $("#val_newcustomerattr").html("");
        $(str.customerAttributes.attributes).each(function () {
          createNewAttrDiv("val_newcustomerattr", this);
          if (actionType == "edit") {
            prepopulateCustomerData(popupId, tagId);
          } else {
            createNewAttr(
              "createNewCustomerPopup",
              "newcustomerattr",
              "custAttributes"
            );
          }
        });
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while getting customer attribute.");
      },
    });
    return false;
  }

  function popProductAttributes(actionType, popupId, tagId) {
    jQuery.ajax({
      type: "GET",
      url: "/product-attribute/get-all",
      dataType: "json",
      success: function (str) {
        $("#val_newproductattr").html("");
        $(str.productAttributes.attributes).each(function () {
          createNewAttrDiv("val_newproductattr", this);
          if (actionType == "edit") {
            prepopulateProductData(popupId, tagId);
          } else {
            createNewAttr(
              "createNewProductPopup",

              "assignNewBranchPopup",
              "newproductattr",
              "AddNewUserPopup",

              "prodAttributes"
            );
          }
        });
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while getting product attribute.");
      },
    });
    return false;
  }

  function createNewAttrDiv(attrDivId, data) {
    var colName =
      typeof data["columnName"] != "undefined" ? data["columnName"] : "";
    var colType =
      typeof data["columnType"] != "undefined" ? data["columnType"] : "";
    var description =
      typeof data["description"] != "undefined" ? data["description"] : "";
    divEle = $('<div id="' + colName.toLowerCase() + '">');
    divEle.append($("<span>").addClass("attrName").append(colName));
    divEle.append($("<span>").addClass("attrType").append(colType));
    divEle.append($("<span>").addClass("attrDesc").append(description));
    $("#" + attrDivId).append(divEle);
  }
  function createNewAttr(popupId, tagId, attrId) {
    var tableId = $("#" + popupId + " ." + attrId);
    tableId.html("");
    $("#val_" + tagId)
      .children()
      .each(function () {
        var attrNameCol = $("<td>")
          .addClass("colAttr")
          .append($(this).children(".attrDesc").text());
        attrNameCol.attr("colName", $(this).children(".attrName").text());
        attrNameCol.attr("colType", $(this).children(".attrType").text());
        if ($(this).children(".attrType").text() == "Cust. Numeric") {
          //TODO: check  if for product attribute also
          clsNumeric = "numeric";
          msgSpan =
            '<span class="validationMsg"><br/>You must enter valid data for attribute.</span>';
        } else {
          clsNumeric = "";
          msgSpan = "";
        }
        var inputVal = $("<input>")
          .addClass("inputText" + " " + clsNumeric)
          .attr("type", "text");
        var attrValCol = $("<td>").append(inputVal);
        attrValCol.append(msgSpan);
        var row = $('<tr class="attrRow">').append(attrNameCol);
        row.append(attrValCol);
        tableId.append(row);
      });
  }
  function populateAttributes(popupId, tagId, attrId, newAttrId) {
    var tableId = $("#" + popupId + " ." + attrId);
    tableId.html("");
    $("#val_" + tagId)
      .children("div")
      .each(function () {
        var attrDesc = $("#val_" + newAttrId)
          .children("#" + $(this).children(".attrName").text().toLowerCase())
          .children(".attrDesc")
          .text();
        var attrType = $("#val_" + newAttrId)
          .children("#" + $(this).children(".attrName").text().toLowerCase())
          .children(".attrType")
          .text();
        var attrNameCol = $("<td>").addClass("colAttr").append(attrDesc);
        attrNameCol.attr("colname", $(this).children(".attrName").text());
        if (attrType.search("Numeric") != -1) {
          clsNumeric = "numeric";
          msgSpan =
            '<span class="validationMsg"><br/>You must enter valid data for attribute.</span>';
        } else {
          clsNumeric = "";
          msgSpan = "";
        }
        var inputVal = $("<input>")
          .addClass("inputText" + " " + clsNumeric)
          .attr("type", "text")
          .attr("value", $(this).children(".attrVal").text());
        var attrValCol = $("<td>").append(inputVal);
        attrValCol.append(msgSpan);
        var row = $('<tr class="attrRow">').append(attrNameCol);
        row.append(attrValCol);
        tableId.append(row);
      });
  }

  function prepopulateProductData(popupId, tagId) {
    $("#editProduct span.validationMsg").hide();
    $("#val_" + tagId)
      .children("span")
      .each(function () {
        if ($(this).attr("class") == "prodUnid") {
          $("#" + popupId + " td." + $(this).attr("class")).text(
            $(this).text()
          );
        } else if ($(this).attr("class") == "prodGroupId") {
          $("#editProduct .inputText.prodGroupId")
            .siblings(".tokenList")
            .empty();
          var li = $("<li>")
            .attr("itemid", $(this).text())
            .text($(this).siblings(".productGroups").text());
          var an = $("<a>")
            .attr("href", "")
            .addClass("deleteToken")
            .append(
              $("<img>").attr("src", "resources/images/deleteInputToken.png")
            );
          li.append(an);
          $("#editProduct .inputText.prodGroupId")
            .siblings(".tokenList")
            .append(li);
          $("#" + popupId + " ." + $(this).attr("class")).attr(
            "unid",
            $(this).text()
          );
        } else if ($(this).attr("class") == "prodOrgId") {
          $("#editProduct ul#organizationId").empty();
          var li = $("<li>")
            .attr("itemid", $(this).text())
            .text($(this).text());
          var an = $("<a>")
            .attr("href", "")
            .addClass("deleteToken")
            .append(
              $("<img>").attr("src", "resources/images/deleteInputToken.png")
            );
          li.append(an);
          $("#editProduct ul#organizationId").append(li);
          $("#" + popupId + " ." + $(this).attr("class")).val($(this).text());
        } else if ($(this).attr("class") == "prodOrgName") {
          $("#editProduct td.customerNameVal").text($(this).text());
        } else {
          $("#" + popupId + " ." + $(this).attr("class")).val($(this).text());
        }
      });
    populateAttributes(popupId, tagId, "prodAttributes", "newproductattr");
  }

  function prepopulateAdjustmentData(popupId, tagId) {
    $("#editAdjustment span.validationMsg").hide();
    $("#adjustmentsRecordsTableEditPopup .adjPricingTypeId").html("");
    $("#pricingTypeDropDown option").each(function () {
      var o = new Option($(this).text(), $(this).val());
      $("#adjustmentsRecordsTableEditPopup .adjPricingTypeId").append(o);
    });
    getAdjustmentDataForEdit($("#val_" + tagId + " .adjUnid").text());
    $("#adjustmentsRecordsTableEditPopup .adjOperation").html(
      $("#pricingTypeOperationDropDown option:first").text()
    );
    $("#" + popupId + " td.customer-name").text("");
    $("#" + popupId + " td input#editAdjCustId").val("");
    $("#" + popupId + " td input#editAdjOrgs").attr("unid", "");
    $("#" + popupId + " .adjOrgs").val("");
    $(".tokenList").empty();
    $(".tokenList").siblings(".inputText").attr("unid", "");
    $("#val_" + tagId)
      .children("span")
      .each(function () {
        if ($(this).attr("class") == "adjUnid") {
          $("#" + popupId + " td." + $(this).attr("class")).text(
            $(this).text()
          );
        } else if ($(this).attr("class") == "adjPricingTypeId") {
          $("#" + popupId + " ." + $(this).attr("class")).val($(this).text());
          $("#pricingTypeOperationDropDown").val($(this).text());
          $("#editAdjustment .adjOperation").html(
            $("#pricingTypeOperationDropDown option:selected").html()
          );
        } else if (
          $(this).attr("class") == "adjCustName" &&
          $(this).text() != ""
        ) {
          $("#" + popupId + " td.customer-name").text($(this).text());
        } else if (
          $(this).attr("class") == "adjCustId" &&
          $(this).text() != ""
        ) {
          $("#" + popupId + " td input#editAdjCustId").val($(this).text());
          var li = $("<li>")
            .attr("itemid", $(this).text())
            .text($(this).text());
          var an = $("<a>")
            .attr("href", "")
            .addClass("deleteToken")
            .append(
              $("<img>").attr("src", "resources/images/deleteInputToken.png")
            );
          li.append(an);
          $("#editAdjustment ul#customerId").append(li);
        } else if ($(this).attr("class") == "adjProdGroupIds") {
          var li = $("<li>")
            .attr("itemid", $(this).text())
            .text($(this).siblings(".adjProdGroups").text());
          var an = $("<a>")
            .attr("href", "")
            .addClass("deleteToken")
            .append(
              $("<img>").attr("src", "resources/images/deleteInputToken.png")
            );
          li.append(an);
          $("#editAdjustment ul#productId").append(li);
          $("#" + popupId + " td input#editAdjProdGroups").attr(
            "unid",
            $(this).text()
          );
        } else if (
          $(this).attr("class") == "adjOrgIds" &&
          $("#" + popupId + " td input#editAdjCustId").val() == ""
        ) {
          $("#" + popupId + " td input#editAdjOrgs").attr(
            "unid",
            $(this).text()
          );
        } else if (
          $(this).attr("class") == "adjOrgs" &&
          $("#" + popupId + " td input#editAdjCustId").val() == ""
        ) {
          var temp = $(this).siblings(".adjOrgIds").text();
          $("#" + popupId + " ." + $(this).attr("class")).attr("unid", temp);
          var li = $("<li>")
            .attr("itemid", $(this).siblings(".adjOrgIds").text())
            .text($(this).text());
          var an = $("<a>")
            .attr("href", "")
            .addClass("deleteToken")
            .append(
              $("<img>").attr("src", "resources/images/deleteInputToken.png")
            );
          li.append(an);
          $("#editAdjustment ul#organizationId").append(li);
          $("#" + popupId + " ." + $(this).attr("class")).val($(this).text());
        } else if ($(this).attr("class") != "adjOrgs") {
          $("#" + popupId + " ." + $(this).attr("class")).val($(this).text());
        }
      });
  }

  function getAdjustmentDataForEdit(unid) {
    var url = "/adjustments/get-by-unid";
    var params = { unid: unid };
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        var objectId = $("#val_adj_" + unid + " .adjProdGroupIds").text();
        if (objectId.indexOf(":") != -1) {
          $("#adjustmentsRecordsTableEditPopup #editAdjProdGroups").val(
            str.adjustments.adjustments[0].objectName
          );
        }
        var orgIds = $("#val_adj_" + unid + " .adjOrgIds").text();
        if (orgIds.indexOf(":") != -1) {
          $("#adjustmentsRecordsTableEditPopup #editAdjOrgs").val(
            str.adjustments.adjustments[0].organizationName
          );
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading edit adjustment form");
        return false;
      },
    });
  }

  function prePopulatePricingTypeData(popupId, tagId) {
    $("#editPricingTypeForm span.validationMsg").hide();
    var selPType = "";
    var selPOper = "";
    $("#val_" + tagId)
      .children("span")
      .each(function () {
        if ($(this).attr("class") == "priTypeUnid") {
          $("#" + popupId + " td." + $(this).attr("class")).text(
            $(this).text()
          );
        } else if ($(this).attr("class") == "priTypeOperationId") {
          selPOper = $(this).text();
        } else if ($(this).attr("class") == "priTypeTarget") {
          selPType = $(this).text();
        } else {
          $("#" + popupId + " ." + $(this).attr("class")).val($(this).text());
        }
      });
    //To create pricing-type drop down
    loadPricingType("#targetTypeDropDownEdit", selPType);
    //Load Operation Drop-down
    loadPricingOperation("#pricingTypeOperationDropDownEdit", selPOper);
  }

  /*--- New Customer/Adjustment/Product popup Call ---*/
  $(".createNewTableRecord").live("click", function () {
    var recordTypeId = $(this).attr("id");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    // $('.pageOverlay').fadeIn('fast');
    $("#" + recordTypeId + "Popup").fadeIn("fast");
    $("#" + recordTypeId + "Popup .inputText").val("");
    $("#" + recordTypeId + "Popup .validationMsg").hide();
    $("#" + recordTypeId + "Popup .jsTokenWrapper .tokenList").empty();
    $("#" + recordTypeId + "Popup .customerNameVal").empty();
    $("#" + recordTypeId + "Popup .inputText").each(function () {
      if (
        $(this).attr("unid") !== "undefined" ||
        $(this).attr("unid") !== false
      ) {
        $(this).attr("unid", "");
      }
    });
    if (
      $("#" + recordTypeId + "Popup .inputText").attr("unid") !== "undefined" ||
      $("#" + recordTypeId + "Popup .inputText").attr("unid") !== false
    ) {
    }
    if ($(".customer-id-drop").is(":visible")) {
      $("#customerRecordsTable tbody tr").addClass("movable");
    }
    if ($(".product-id-drop").is(":visible")) {
      $("#productsRecordsTable tbody tr").addClass("movable");
    }

    //Set the default start/end date
    if (recordTypeId == "createNewCustomer") {
      $("#createCustomer input#custStartDate").val($("#defStartDate").text());
      $("#createCustomer input#custEndDate").val($("#defEndDate").text());
      if ($("#val_newcustomerattr").children().length == 0) {
        popCustomerAttributes();
      } else {
        createNewAttr(
          "createNewCustomerPopup",
          "newcustomerattr",
          "custAttributes"
        );
      }
    } else if (recordTypeId == "createNewAdjustment") {
      $("#createAdjustment td.customer-name").text("");
      $("#createAdjustment td input#editAdjCustId").val("");
      $("#createAdjustment td input#editAdjOrgs").attr("unid", "");
      $("#createAdjustment .adjOrgs").val("");
      $("#createAdjustment .adjPricingTypeId").html("");
      $("#pricingTypeDropDown option").each(function () {
        var o = new Option($(this).text(), $(this).val());
        $("#createAdjustment .adjPricingTypeId").append(o);
      });
      $("#createAdjustment .adjOperation").html(
        $("#pricingTypeOperationDropDown option:first").text()
      );
      $("#createAdjustment input.adjStartDate").val($("#defStartDate").text());
      $("#createAdjustment input.adjEndDate").val($("#defEndDate").text());
    } else if (recordTypeId == "createNewProduct") {
      $("#createProduct input#proStartDate").val($("#defStartDate").text());
      $("#createProduct input#proEndDate").val($("#defEndDate").text());
      if ($("#val_newproductattr").children().length == 0) {
        popProductAttributes();
      } else {
        createNewAttr(
          "createNewProductPopup",
          "AddNewUserPopup",
          "assignNewBranchPopup",
          "newproductattr",
          "prodAttributes"
        );
      }
    } else if (recordTypeId == "AddNewUser") {
      $("#createProduct input#proStartDate").val($("#defStartDate").text());
      $("#createProduct input#proEndDate").val($("#defEndDate").text());
      if ($("#val_newproductattr").children().length == 0) {
        popProductAttributes();
      } else {
        createNewAttr("AddNewUserPopup");
      }
    } else if (recordTypeId == "assignNewBranch") {
      $("#createProduct input#proStartDate").val($("#defStartDate").text());
      $("#createProduct input#proEndDate").val($("#defEndDate").text());
      if ($("#val_newproductattr").children().length == 0) {
        popProductAttributes();
      } else {
        createNewAttr("assignNewBranchPopup");
      }
    }
    return false;
  });

  /*----- Configur Table Scripts ----- */
  $(".configTableLink").live("click", function () {
    $(this).siblings(".configTableDropdown").toggle();
    return false;
  });
  $(".seeMoreLink").live("click", function () {
    $(this).siblings(".allFiltersList").toggle();
    return false;
  });

  $(".removeFilterPrompt").live("click", function () {
    $(this)
      .parents(".configNavTableWrapper")
      .siblings(".filterListWrapper")
      .children(".filtersDisplayList")
      .empty();
    $(this)
      .parents(".configNavTableWrapper")
      .siblings(".filterListWrapper")
      .children(".filtersDisplayList")
      .siblings()
      .children(".italicText")
      .text("");
  });

  /*--- adding filters while clicking -- */
  $(".filterList .filterLink").live("click", function () {
    $(this)
      .parents(".configNavTableWrapper")
      .siblings(".filterListWrapper")
      .children(".filtersDisplayList")
      .html("");
    var parentId = $(this).parents(".configTableDropdown").attr("id");
    $("." + parentId + "DisplayList")
      .siblings()
      .children(".italicText")
      .text("filtered by");
    var filterText = $(this).html();
    var filterMarkup =
      '<li><a href="#" class="removeFilterLink"><img src="resources/images/removeFilter.png"></a><span>' +
      filterText +
      "</span></li>";
    $(".configTableDropdown, .allFiltersList").hide();
    $("." + parentId + "DisplayList").append(filterMarkup);
    return false;
  });
  $(".removeFilterLink").live("click", function () {
    if (
      $(this).parents(".fleft").hasClass("customerTableFiltersDisplayList") ==
      true
    ) {
      $("#customerNewFilter").attr("search", "off");
      $(".customerTableFiltersDisplayList")
        .siblings()
        .children(".italicText")
        .text("");
      getCustomerFirstPage(false);
    }
    if (
      $(this).parents(".fleft").hasClass("adjustmentTableFiltersDisplayList") ==
      true
    ) {
      $("#adjustmentNewFilter").attr("search", "off");
      $(".adjustmentTableFiltersDisplayList")
        .siblings()
        .children(".italicText")
        .text("");
      getAdjustmentFirstPage(false);
    }
    if (
      $(this).parents(".fleft").hasClass("productsTableFiltersDisplayList") ==
      true
    ) {
      $("#newProductFilter").attr("search", "off");
      $(".productsTableFiltersDisplayList")
        .siblings()
        .children(".italicText")
        .text("");
      getProductFirstPage(false);
    }
    $(this).parents("li").remove();
    return false;
  });

  /*------ Create Filter Calling ---*/
  $(".newFilterItem a").click(function () {
    var parentId = $(this).parents(".newFilterItem").attr("dropdownId");
    $(".configTableDropdown, .allFiltersList").hide();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    if (parentId == "adjustmentTableFilters") {
      $("#adjAdvanceSearch div #advSearchPrcOperation").empty();
      $("#adjAdvanceSearch div #advSearchCustName").empty();
      $("#adjAdvanceSearch .adjSerOrgIdTxt").attr("unid", "");
      $("#adjSerProdGrpIdTxt").attr("unid", "");
      $("#adjAdvanceSearch")[0].reset();
      $("#adjAdvanceSearch ul.tokenList").empty();
      loadPricingType("#adjSerPrcType");
    }
    if (parentId == "customerTableFilters") {
      $("#custAdvanceSearch ul.tokenList").empty();
      $("#custAdvanceSearch .adjSerOrgIdTxt").attr("unid", "");
      $("#custAdvanceSearch")[0].reset();
      $("#custAdvanceSearch input#custAdvSrcGrpId").attr("value", "");
    }
    if (parentId == "productsTableFilters") {
      $("#prodAdvanceSearch ul.tokenList").empty();
      $("#prodAdvanceSearch div#proSrcCustName").empty();
      $("#prodAdvanceSearch textarea#proSrcProductGrpTxt").attr("unid", "");
      $("#prodAdvanceSearch textarea#proSrcProductGrpTxt").val("");
      $("#prodAdvanceSearch")[0].reset();
      $("#prodAdvanceSearch .proSrcProductGrp").attr("value", "");
      $("#prodAdvanceSearch .adjProdGroups").attr("unid", "");
    }
    $("#" + parentId + "NewFilterPopup").fadeIn("fast");
    return false;
  });
  $("li.chooseCol a").click(function () {
    var parentId = $(this).parents(".configTableDropdown").attr("id");
    $(".configTableDropdown, .allFiltersList").hide();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    if (parentId == "customerTableFilters") {
      loadCustomerColumn();
      $("#chooseColumnHeader").html(chooseColCustomer);
    } else if (parentId == "productsTableFilters") {
      loadProductColumn();
      $("#chooseColumnHeader").html(chooseColProduct);
    } else if (parentId == "adjustmentTableFilters") {
      loadAdjustmentColumn();
      $("#chooseColumnHeader").html(chooseColAdjustment);
    }
    $("#ChooseColPopup").fadeIn("fast");
    return false;
  });
  function loadCustomerColumn() {
    $("#choosecolumn #columnDisplayed").html("");
    $("#custcolumnhide #customerTableDisplayed option").each(function () {
      var o = new Option($(this).text(), $(this).val());
      $("#choosecolumn #columnDisplayed").append(o);
    });
    $("#choosecolumn #columnNotDisplayed").html("");
    $("#custcolumnhide #customerTableNotDisplayed option").each(function () {
      var o = new Option($(this).text(), $(this).val());
      $("#choosecolumn #columnNotDisplayed").append(o);
    });
  }
  function loadProductColumn() {
    $("#choosecolumn #columnDisplayed").html("");
    $("#prodcolumnhide #productTableDisplayed option").each(function () {
      var o = new Option($(this).text(), $(this).val());
      $("#choosecolumn #columnDisplayed").append(o);
    });
    $("#choosecolumn #columnNotDisplayed").html("");
    $("#prodcolumnhide #productTableNotDisplayed option").each(function () {
      var o = new Option($(this).text(), $(this).val());
      $("#choosecolumn #columnNotDisplayed").append(o);
    });
  }
  function loadAdjustmentColumn() {
    $("#choosecolumn #columnDisplayed").html("");
    $("#adjcolumnhide #adjustmentTableDisplayed option").each(function () {
      var o = new Option($(this).text(), $(this).val());
      $("#choosecolumn #columnDisplayed").append(o);
    });
    $("#choosecolumn #columnNotDisplayed").html("");
    $("#adjcolumnhide #adjustmentTableNotDisplayed option").each(function () {
      var o = new Option($(this).text(), $(this).val());
      $("#choosecolumn #columnNotDisplayed").append(o);
    });
  }
  /*--- Records Per Page Pop Up ---*/
  $(".recordsPerPage").live("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#recordsPerPagePopUp").fadeIn("fast");
    $("#recordPerPageForm span.validationMsg").hide();
    $("#recordPerPageForm")[0].reset();
    if ($(this).parents("ul").attr("id") == "customerConfigList") {
      $("#recordPerPageForm input#records").val(
        parseInt($(".customerPaginationData span.endIndex").html())
      );
      $("#recordPerPageForm .submitBtn").attr("id", "customerRecordsPerPage");
    } else if ($(this).parents().attr("id") == "adjustmentConfigList") {
      $("#recordPerPageForm input#records").val(
        parseInt($(".adjustmentPaginationData span.endIndex").html())
      );
      $("#recordPerPageForm .submitBtn").attr("id", "adjustmentRecordsPerPage");
    } else if ($(this).parents().attr("id") == "productConfigList") {
      $("#recordPerPageForm input#records").val(
        parseInt($(".productPaginationData span.endIndex").html())
      );
      $("#recordPerPageForm .submitBtn").attr("id", "productRecordsPerPage");
    } else if ($(this).parents().attr("id") == "pricingTypeConfigList") {
      $("#recordPerPageForm input#records").val(
        parseInt($(".pricingTypePaginationData span.endIndex").html())
      );
      $("#recordPerPageForm .submitBtn").attr(
        "id",
        "pricingTypeRecordsPerPage"
      );
    } else if ($(this).parents().attr("id") == "pricingSeqConfigList") {
      $("#recordPerPageForm input#records").val(
        parseInt($(".pricingSeqPaginationData span.endIndex").html())
      );
      $("#recordPerPageForm .submitBtn").attr("id", "pricingSeqRecordsPerPage");
    } else if ($(this).parents().attr("id") == "groupComboConfigList") {
      $("#recordPerPageForm input#records").val(
        parseInt($(".groupComboPaginationData span.endIndex").html())
      );
      $("#recordPerPageForm .submitBtn").attr("id", "groupComboRecordsPerPage");
    } else if ($(this).parents().attr("id") == "prodAttrConfigList") {
      $("#recordPerPageForm input#records").val(
        parseInt($(".productAttrPaginationData span.endIndex").html())
      );
      $("#recordPerPageForm .submitBtn").attr("id", "prodAttrRecordsPerPage");
    } else if ($(this).parents().attr("id") == "custAttrConfigList") {
      $("#recordPerPageForm input#records").val(
        parseInt($(".customerAttrPaginationData span.endIndex").html())
      );
      $("#recordPerPageForm .submitBtn").attr("id", "custAttrRecordsPerPage");
    }
    return false;
  });

  /*----- Minimizing and Maximizing tables ----*/
  $(".master-data-table-container .recordCategory .minimizeLink").live(
    "click",
    function () {
      var maxlinkActiveId = $(this).parents(".recordTableWrapper").attr("id");
      $(this).parents(".recordTableWrapper").hide();
      $(".maximized-link-list li#maximize-" + maxlinkActiveId).show();
      if (maxlinkActiveId == "customerRecordTable") {
        addLayoutConfiguration("list-item", "MINIMIZED_CUSTOMER_RECORD_TABLE");
      } else if (maxlinkActiveId == "adjustmentRecordTable") {
        addLayoutConfiguration(
          "list-item",
          "MINIMIZED_ADJUSTMENT_RECORD_TABLE"
        );
      } else if (maxlinkActiveId == "productsRecordTable") {
        addLayoutConfiguration("list-item", "MINIMIZED_PRODUCTS_RECORD_TABLE");
      }
      return false;
    }
  );
  $(".maximized-link-list li a.maximizeLink").live("click", function () {
    var showTableId = $(this).parents("li").attr("maxTable");
    $(this).parents("li").hide();
    $(".recordTableWrapper#" + showTableId).show();
    if (showTableId == "customerRecordTable") {
      addLayoutConfiguration("none", "MINIMIZED_CUSTOMER_RECORD_TABLE");
    } else if (showTableId == "adjustmentRecordTable") {
      addLayoutConfiguration("none", "MINIMIZED_ADJUSTMENT_RECORD_TABLE");
    } else if (showTableId == "productsRecordTable") {
      addLayoutConfiguration("none", "MINIMIZED_PRODUCTS_RECORD_TABLE");
    }
    return false;
  });

  /*--- popup tabs switching -- */
  $(".popupTablist li a").live("click", function () {
    var tabNumber = $(this).attr("tab");
    var parentId = $(this).parents(".popupTablist").attr("id");
    $("#" + parentId + " li.active").removeClass("active");
    $(this).parents("li").addClass("active");
    $("#" + parentId + "-Div .tabs-section").hide();
    $("#" + parentId + "-Div .tab-" + tabNumber).show();
    return false;
  });

  $(".popupTablist li a").on("click", function () {
    var tabNumber = $(this).attr("tab");
    var parentId = $(this).parents(".popupTablist").attr("id");
    $("#" + parentId + " li.active").removeClass("active");
    $(this).parents("li").addClass("active");
    $("#" + parentId + "-Div .tabs-section").hide();
    $("#" + parentId + "-Div .tab-" + tabNumber).show();
    return false;
  });

  /*-- Choose columns in the table layouts --*/
  $(".shiftToDisplay").live("click", function () {
    var destinationDiv = $(this)
      .parents(".colControls")
      .siblings(".colDisplayed")
      .children("select");
    var optionsTomove = $(this)
      .parents(".colControls")
      .siblings(".colNotDisplayed")
      .children("select")
      .children("option:selected");
    optionsTomove.each(function () {
      destinationDiv.append($(this));
    });
    return false;
  });

  $(".shiftAllToDisplay").live("click", function () {
    var destinationDiv = $(this)
      .parents(".colControls")
      .siblings(".colDisplayed")
      .children("select");
    var optionsTomove = $(this)
      .parents(".colControls")
      .siblings(".colNotDisplayed")
      .children("select")
      .children("option");
    optionsTomove.each(function () {
      destinationDiv.append($(this));
    });
    return false;
  });

  $(".shiftToNotDisplay").live("click", function () {
    var destinationDiv = $(this)
      .parents(".colControls")
      .siblings(".colNotDisplayed")
      .children("select");
    var optionsTomove = $(this)
      .parents(".colControls")
      .siblings(".colDisplayed")
      .children("select")
      .children("option:selected");
    optionsTomove.each(function () {
      destinationDiv.append($(this));
    });
    return false;
  });

  $(".shiftAllToNotDisplay").live("click", function () {
    var destinationDiv = $(this)
      .parents(".colControls")
      .siblings(".colNotDisplayed")
      .children("select");
    var optionsTomove = $(this)
      .parents(".colControls")
      .siblings(".colDisplayed")
      .children("select")
      .children("option");
    optionsTomove.each(function () {
      destinationDiv.append($(this));
    });
    return false;
  });
  /* Manual Records Configuration Per Page for Customers  */
  $("#customerRecordsPerPage").live("click", function () {
    if (isInteger($("#recordPerPageForm input#records").val()) == false) {
      $("#recordPerPageForm span.validationMsg").show();
      return false;
    }
    var params = {
      accessname: customerPerPageRecords,
      val: $("#recordPerPageForm input#records").val(),
    };
    customerRecordsPerPage = parseInt(
      $("#recordPerPageForm input#records").val()
    );
    jQuery.ajax({
      type: "POST",
      url: "/configuration/configure-table-records",
      data: params,
      dataType: "json",
      success: function (str) {
        $(".pageOverlay").fadeOut("fast");
        $("#recordsPerPagePopUp").fadeOut("fast");
        //customerRecordsPerPage = parseInt(params.val);
        $(".customerPaginationData span.endIndex").html(customerRecordsPerPage);
        var startIndex = 1;
        var endIndex = customerRecordsPerPage;
        var totalRecords = endIndex - startIndex + 1;
        if ($("#custSearch .inputText").attr("search") == "on") {
          var params = {
            searchStr: $("#custSearch input.inputText").val(),
            startIndex: startIndex,
            endIndex: endIndex,
            totalRecords: totalRecords,
          };
          loadCustomerSearchData(params);
          $("#customerRecordTable span.pageNum").text(startIndex);
        } else if ($("#customerNewFilter").attr("search") == "on") {
          var params = customerAdvSearchParams;
          params.startIndex = startIndex;
          params.endIndex = endIndex;
          params.totalRecords = totalRecords;
          loadCustomerAdvanceSearchData(params);
          $("#customerRecordTable span.pageNum").text(parseInt(startIndex));
          return false;
        } else {
          getCustomerFirstPage(false);
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while configuring the table records.");
      },
    });
    $("#recordPerPageForm span.validationMsg").hide();
    $("#recordPerPageForm")[0].reset();
  });
  /* Manual Records Configuration Per Page for Adjustments */
  $("#adjustmentRecordsPerPage").live("click", function () {
    if (isInteger($("#recordPerPageForm input#records").val()) == false) {
      $("#recordPerPageForm span.validationMsg").show();
      return false;
    }
    var params = {
      accessname: adjustmentPerPageRecords,
      val: $("#recordPerPageForm input#records").val(),
    };
    adjustmentRecordsPerPage = parseInt(
      $("#recordPerPageForm input#records").val()
    );
    jQuery.ajax({
      type: "POST",
      url: "/configuration/configure-table-records",
      data: params,
      dataType: "json",
      success: function (str) {
        $(".pageOverlay").fadeOut("fast");
        $("#recordsPerPagePopUp").fadeOut("fast");
        $(".adjustmentPaginationData span.endIndex").html(
          adjustmentRecordsPerPage
        );
        if ($("#adjSearch .inputText").attr("search") == "on") {
          var sortCol = $(".adjustmentPaginationData span.sortCol").text();
          var sortDir = $(".adjustmentPaginationData span.sortDir").text();
          var startIndex = 1;
          var endIndex = adjustmentRecordsPerPage;
          var totalRecords = endIndex - startIndex + 1;
          var params = {
            searchStr: $("#adjSearch input.inputText").val(),
            startIndex: startIndex,
            endIndex: endIndex,
            totalRecords: totalRecords,
            sortCol: sortCol,
            sortDir: sortDir,
          };
          loadAdjustmentSearchData(params);
        } else if ($("#adjustmentNewFilter").attr("search") == "on") {
          var params = adjustmentAdvSearchParams;
          params.startIndex = startIndex;
          params.endIndex = endIndex;
          params.totalRecords = totalRecords;
          loadAdjustmentAdvanceSearch(params);
          $("#adjustmentRecordTable span.pageNum").text(parseInt(1));
          return false;
        } else {
          getAdjustmentFirstPage(false);
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while configuring the table records.");
      },
    });
    $("#recordPerPageForm span.validationMsg").hide();
    $("#recordPerPageForm")[0].reset();
  });
  /* Manual Records Configuration Per Page for Products */
  $("#productRecordsPerPage").live("click", function () {
    if (isInteger($("#recordPerPageForm input#records").val()) == false) {
      $("#recordPerPageForm span.validationMsg").show();
      return false;
    }
    var params = {
      accessname: productPerPageRecords,
      val: $("#recordPerPageForm input#records").val(),
    };
    productRecordsPerPage = parseInt(
      $("#recordPerPageForm input#records").val()
    );
    jQuery.ajax({
      type: "POST",
      url: "/configuration/configure-table-records",
      data: params,
      dataType: "json",
      success: function (str) {
        $(".pageOverlay").fadeOut("fast");
        $("#recordsPerPagePopUp").fadeOut("fast");
        $(".productPaginationData span.endIndex").html(productRecordsPerPage);
        var startIndex = 1;
        var endIndex = productRecordsPerPage;
        var totalRecords = endIndex - startIndex + 1;
        if ($("#prodSearch .inputText").attr("search") == "on") {
          var params = {
            searchStr: $("#prodSearch input.inputText").val(),
            startIndex: startIndex,
            endIndex: endIndex,
            totalRecords: totalRecords,
          };
          loadProductSearchData(params);
          $("#productsRecordTable span.pageNum").text(1);
        } else if ($("#newProductFilter").attr("search") == "on") {
          params = productAdvSearchParams;
          params.startIndex = startIndex;
          params.endIndex = endIndex;
          params.totalRecords = totalRecords;
          loadProductAdvanceSearchData(params);
          $("#productsRecordTable span.pageNum").text(1);
        } else {
          getProductFirstPage(false);
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while configuring the table records.");
      },
    });
    $("#recordPerPageForm span.validationMsg").hide();
    $("#recordPerPageForm")[0].reset();
  });
  /* Manual Records Configuration Per Page for Pricing type */
  $("#pricingTypeRecordsPerPage").live("click", function () {
    if (isInteger($("#recordPerPageForm input#records").val()) == false) {
      $("#recordPerPageForm span.validationMsg").show();
      return false;
    }
    var params = {
      accessname: pricingTypePerPageRecords,
      val: $("#recordPerPageForm input#records").val(),
    };
    pricingTypeRecordsPerPage = parseInt(
      $("#recordPerPageForm input#records").val()
    );
    jQuery.ajax({
      type: "POST",
      url: "/configuration/configure-table-records",
      data: params,
      dataType: "json",
      success: function (str) {
        $(".pageOverlay").fadeOut("fast");
        $("#recordsPerPagePopUp").fadeOut("fast");
        $(".pricingTypePaginationData span.endIndex").html(
          pricingTypeRecordsPerPage
        );
        getPricingTypeFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while configuring the table records.");
      },
    });
    $("#recordPerPageForm span.validationMsg").hide();
    $("#recordPerPageForm")[0].reset();
  });

  /* Manual Records Configuration Per Page for Pricing Sequence */
  $("#pricingSeqRecordsPerPage").live("click", function () {
    if (isInteger($("#recordPerPageForm input#records").val()) == false) {
      $("#recordPerPageForm span.validationMsg").show();
      return false;
    }
    var params = {
      accessname: pricingSeqPerPageRecords,
      val: $("#recordPerPageForm input#records").val(),
    };
    pricingSeqRecordsPerPage = parseInt(
      $("#recordPerPageForm input#records").val()
    );
    jQuery.ajax({
      type: "POST",
      url: "/configuration/configure-table-records",
      data: params,
      dataType: "json",
      success: function (str) {
        $(".pageOverlay").fadeOut("fast");
        $("#recordsPerPagePopUp").fadeOut("fast");
        $(".pricingSeqPaginationData span.endIndex").html(
          pricingSeqRecordsPerPage
        );
        getPricingSeqFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while configuring the table records.");
      },
    });
    $("#recordPerPageForm span.validationMsg").hide();
    $("#recordPerPageForm")[0].reset();
  });

  /* Manual Records Configuration Per Page for Group Combo */
  $("#groupComboRecordsPerPage").live("click", function () {
    if (isInteger($("#recordPerPageForm input#records").val()) == false) {
      $("#recordPerPageForm span.validationMsg").show();
      return false;
    }
    var params = {
      accessname: groupComboPerPageRecords,
      val: $("#recordPerPageForm input#records").val(),
    };
    groupComboRecordsPerPage = parseInt(
      $("#recordPerPageForm input#records").val()
    );
    jQuery.ajax({
      type: "POST",
      url: "/configuration/configure-table-records",
      data: params,
      dataType: "json",
      success: function (str) {
        $(".pageOverlay").fadeOut("fast");
        $("#recordsPerPagePopUp").fadeOut("fast");
        $(".pricingSeqPaginationData span.endIndex").html(
          groupComboRecordsPerPage
        );
        getGroupComboFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while configuring the table records.");
      },
    });
    $("#recordPerPageForm span.validationMsg").hide();
    $("#recordPerPageForm")[0].reset();
  });

  /* Manual Records Configuration Per Page for Product Attribute */
  $("#prodAttrRecordsPerPage").live("click", function () {
    if (isInteger($("#recordPerPageForm input#records").val()) == false) {
      $("#recordPerPageForm span.validationMsg").show();
      return false;
    }
    var params = {
      accessname: prodAttrPerPageRecords,
      val: $("#recordPerPageForm input#records").val(),
    };
    prodAttrRecordsPerPage = parseInt(
      $("#recordPerPageForm input#records").val()
    );
    jQuery.ajax({
      type: "POST",
      url: "/configuration/configure-table-records",
      data: params,
      dataType: "json",
      success: function (str) {
        $(".pageOverlay").fadeOut("fast");
        $("#recordsPerPagePopUp").fadeOut("fast");
        $(".productAttrPaginationData span.endIndex").html(
          prodAttrRecordsPerPage
        );
        getProductAttributeFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while configuring the table records.");
      },
    });
    $("#recordPerPageForm span.validationMsg").hide();
    $("#recordPerPageForm")[0].reset();
  });

  /* Manual Records Configuration Per Page for Customer Attribute */
  $("#custAttrRecordsPerPage").live("click", function () {
    if (isInteger($("#recordPerPageForm input#records").val()) == false) {
      $("#recordPerPageForm span.validationMsg").show();
      return false;
    }
    var params = {
      accessname: custAttrPerPageRecords,
      val: $("#recordPerPageForm input#records").val(),
    };
    custAttrRecordsPerPage = parseInt(
      $("#recordPerPageForm input#records").val()
    );
    jQuery.ajax({
      type: "POST",
      url: "/configuration/configure-table-records",
      data: params,
      dataType: "json",
      success: function (str) {
        $(".pageOverlay").fadeOut("fast");
        $("#recordsPerPagePopUp").fadeOut("fast");
        $(".customerAttrPaginationData span.endIndex").html(
          custAttrRecordsPerPage
        );
        getCustomerAttributeFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while configuring the table records.");
      },
    });
    $("#recordPerPageForm span.validationMsg").hide();
    $("#recordPerPageForm")[0].reset();
  });

  /*---- Create new Pricing Type ---- */
  $("#createNewPricingTypeLink").live("click", function () {
    $(".validationMsg").hide();
    $("#createPricingTypeForm")[0].reset();
    loadPricingType("#targetTypeDropDown");
    loadPricingOperation("#pricingTypeOperationDropDown");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#createPricingTypePopup").fadeIn("fast");
    return false;
  });

  $("#pricingTypeDelete").live("click", function () {
    var params = { unid: $("span#pricingTypeUnid").text() };
    var url = "/pricing-type/delete";
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response.message);
        $(".pageOverlay").fadeOut("fast");
        $(".popupWrapper").fadeOut("fast");
        getPricingTypeFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while deleting the pricing type.");
      },
    });
  });

  /*------ Delete Pricing Sequences --------*/

  $("#deletePricingSeqs").live("click", function () {
    var url = "/pricing-sequence/delete";
    var params = { unid: $("span#pricingSequenceUnid").text() };
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        popSuccessMessage(str.response[0].message);
        $(".pageOverlay").fadeOut("fast");
        $(".popupWrapper").fadeOut("fast");
        getPricingSeqFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while deleting pricing sequence");
      },
    });
  });

  /*------ delete Attributes ----*/
  $("#customerAttributeDelete").live("click", function () {
    var url = "/customer-attribute/delete";
    var params = { unid: $("span#attributeUnid").text() };
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        popSuccessMessage(str.baseResponse.message);
        $(".pageOverlay").fadeOut("fast");
        $(".popupWrapper").fadeOut("fast");
        getCustomerAttributeFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while deleting the customer attribute.");
      },
    });
  });

  $("#productAttributeDelete").live("click", function () {
    var url = "/product-attribute/delete";
    var params = { unid: $("span#productAttributeUnid").text() };
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        popSuccessMessage(str.baseResponse.message);
        $(".pageOverlay").fadeOut("fast");
        $(".popupWrapper").fadeOut("fast");
        getProductAttributeFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while deleting the product attribute.");
      },
    });
  });

  $("#groupComboDelete").live("click", function () {
    var params = { unid: $("span#gComboUnid").html() };
    var url = "/group-combo/delete";
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        popSuccessMessage(str.response[0].message);
        $(".pageOverlay").fadeOut("fast");
        $(".popupWrapper").fadeOut("fast");
        getGroupComboFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while deleting the groupcombo.");
      },
    });
  });

  /*------ Pricing Sequences Scripts--------*/
  $("#pricingSeqRecordsTable .expandRowLink").live("click", function () {
    $(this).addClass("hidden");
    $(this).siblings(".collapseRowLink").removeClass("hidden");
    var rowId = $(this).parents("tr.expandableRow").attr("id").split("_");
    var pricingTypeRow = $("<tr>").addClass("editPricingSeqRowWrapper");
    var pricingTypeTd = $("<td>")
      .attr("colspan", "3")
      .addClass("editPricingSeqRow");
    var divEle = $("<div>").addClass("pricingSeqTableWrapper");
    var tblEle = $("<table>").addClass("recordsTable pricingSeqDetailsTable");
    var tblHead = $("<thead>");
    var tblHeadRow = $("<tr>");
    var pricingTypeCol = $("<th>")
      .addClass("priceTypeCol")
      .append("Pricing Type");
    var targetCol = $("<th>").addClass("targetCol").append("Target");
    var extraTh = $("<th>");
    var recordTbl = $("<table>").addClass(
      "recordsTable pricingTypeList updatePricingTypeNewSeqTable"
    );
    var recordTblBody = $("<tbody>").addClass("sortablePricingTypes");
    pricingTypeRow.append(pricingTypeTd);
    pricingTypeTd.append(divEle);
    divEle.append(tblEle);
    tblEle.append(tblHead);
    tblHead.append(tblHeadRow);
    tblHeadRow.append(pricingTypeCol);
    tblHeadRow.append(targetCol);
    tblHeadRow.append(extraTh);
    divEle.append(recordTbl);
    recordTbl.append(recordTblBody);

    var retVal = loadPricingTypeSeq(rowId[1], recordTblBody);
    // For Drag and drop of new pricing type

    $(this).parents("tr.expandableRow").addClass("expandedRow");
    $(this).parents("tr.expandableRow").after(pricingTypeRow);
    $("#pricingTypesRecordsTable tbody tr").draggable({
      appendTo: "body",
      helper: "clone",
    });

    $(".sortablePricingTypes").sortable();
    $("table.updatePricingTypeNewSeqTable tbody").droppable({
      // activeClass: "ui-state-default",
      // hoverClass: "ui-state-hover",

      accept: "#pricingTypesRecordsTable tbody tr.ui-draggable",
      drop: function (event, ui) {
        dropOperationPricingTypeSeq(this, ui, rowId[1]);
      },
    });
    return false;
  });

  //For Edit pricing sequence
  $("#editPricingSequence").live("click", function () {
    var rowId = $(this).parents("tr.expandableRow").attr("id").split("_");
    var url = "/pricing-sequence/edit";
    var hidPricingId = $(".pricingTypeIdHid_" + rowId[1]);
    var selPricingTypeIds = "";
    hidPricingId.each(function (i) {
      selPricingTypeIds += $(this).val() + ",";
    });
    if (selPricingTypeIds.indexOf(",") >= 0) {
      selPricingTypeIds = selPricingTypeIds.substr(
        0,
        selPricingTypeIds.length - 1
      );
    }

    var params = {
      description: $(".pricing-seq-desc-txt_" + rowId[1]).val(),
      unid: rowId[1],
      pricingTypeIds: selPricingTypeIds,
    };
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response[0].message);
        getPricingSeqFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while updating the pricing sequence.");
      },
    });
  });
  $("#pricingSeqRecordsTable .collapseRowLink").live("click", function () {
    $(this).addClass("hidden");
    $(this).siblings(".expandRowLink").removeClass("hidden");
    $(this).parents("tr.expandableRow").removeClass("expandedRow");
    $(this)
      .parents("tr.expandableRow")
      .next(".editPricingSeqRowWrapper")
      .remove();
    return false;
  });

  $("#pricingSeqRecordsTable .editPricingSeqPricingTypeRow").live(
    "click",
    function () {
      $(this).parent("td").css({ width: "65px" });
      $(this).siblings(".savePricingLink, .closeEditRowLink").toggle();
      if (
        $(this)
          .parents("tr")
          .next(".editPricingSeqRowWrapper")
          .is(":visible") == false
      ) {
        $(this)
          .parents("td")
          .siblings("td")
          .children(".expandRowLink")
          .trigger("click");
      }
      var rowId = $(this).parents("tr.expandableRow").attr("id").split("_");
      var seq_description = $(this)
        .parents("td")
        .siblings(".pricing-seq-desc")
        .text();
      $(this).parents("td").siblings(".pricing-seq-desc").text("");
      var seq_des_txt = $("<input>")
        .addClass("inputText pricing-seq-desc-txt_" + rowId[1])
        .attr("type", "text")
        .attr("value", seq_description);
      $(this).parents("td").siblings(".pricing-seq-desc").append(seq_des_txt);

      $(".editPricingSeqRowWrapper .deleteSeqEditRow").show();
      $(this)
        .parents("td")
        .siblings(".pricingSeqName")
        .children(".inputText")
        .removeClass("readonlyInput")
        .removeAttr("readonly")
        .focus();
      $(this).hide();
      return false;
    }
  );
  $("#pricingSeqRecordsTable .closeEditRowLink").live("click", function () {
    $(this).parent("td").css({ width: "48px" });
    $(this)
      .siblings(".savePricingLink, .editPricingSeqPricingTypeRow")
      .toggle();
    $(this)
      .parents("td")
      .siblings("td")
      .children(".collapseRowLink")
      .trigger("click");
    $(this)
      .parents("td")
      .siblings(".pricingSeqName")
      .children(".inputText")
      .addClass("readonlyInput")
      .attr("readonly");
    var rowId = $(this).parents("tr.expandableRow").attr("id").split("_");
    var seq_description = $(this)
      .parents("td")
      .siblings(".pricing-seq-desc")
      .children(".pricing-seq-desc-txt_" + rowId[1])
      .val();
    $(this).parents("td").siblings(".pricing-seq-desc").text(seq_description);
    $(this).hide();
    return false;
  });

  $("#createNewPricingSeq").live("click", function () {
    rowId = Math.floor(Math.random() * 1000000);
    var parentRowhtml =
      "<tr class='expandableRow expandedRow' id='" +
      rowId +
      "'><td class='first-child'>" +
      "<a href='' class='expandRowLink hidden'><img src='../../resources/images/expand-row.png'></a>" +
      "<a href='' class='collapseRowLink'><img src='../../resources/images/collapse-row.png'>" +
      "</a><input class='inputText pricingSeq' style='width:40px;margin-left:10px' disabled/></td><td class='pricingSeqName'><input class='inputText pricingSequenceDescription mandatory' title='Add Pricing description here'><span class='validationMsg'><br/>Please enter a valid sequence description.</span></td><td class='last-child'><a href='#' class='savePricingLink' id='savePricingSequence'><img src='../../resources/images/saveLink.png'></a><a href='' class='closeEditRowLink deleteNewPricingSeqOpened'><img src='../../resources/images/delete-edit-row.png'></a><a href='' class='editPricingSeqPricingTypeRow hidden'><img src='../../resources/images/editRow.png'></a><a href='' class='deleteRowLink hidden'><img src='../../resources/images/deleteRow.png'></a></td></tr>";
    var editRowHtml =
      "<tr class='editPricingSeqRowWrapper'><td colspan='3' class='editPricingSeqRow'><div class='pricingSeqTableWrapper'><table class='recordsTable pricingSeqDetailsTable'><thead><tr><th class='priceTypeCol'>Pricing Type</th>" +
      "<th class='targetCol'>Target</th><th></th></tr></thead></table>" +
      "<table class='recordsTable pricingTypeList addPricingTypeNewSeqTable' id=''><tbody>" +
      "<tr class='placeholder'><td class='dragDropTitle' colspan='6'>Drag and drop pricing types from the pricing table above.</td></tr></tbody></table></div></td></tr>";
    $("#pricingSeqRecordsTable").append(parentRowhtml).append(editRowHtml);

    $(".deleteNewPricingSeqOpened").live("click", function () {
      $(this)
        .parents(".expandableRow")
        .next(".editPricingSeqRowWrapper")
        .remove();
      $(this).parents(".expandableRow").remove();
      return false;
    });

    $("#pricingTypesRecordsTable tbody tr").draggable({
      appendTo: "body",
      helper: "clone",
    });
    $("table.addPricingTypeNewSeqTable tbody").droppable({
      // activeClass: "ui-state-default",
      // hoverClass: "ui-state-hover",
      accept: "#pricingTypesRecordsTable tbody tr.ui-draggable",
      drop: function (event, ui) {
        // $(this).children(
        // ".placeholder" ).remove();
        // $("<tr></tr>").html(
        // ui.draggable.html()
        // ).prependTo(this);
        // var pricingTypeRow =
        // $('<tr>');
        // pricingTypeRow.attr("id",'pricingTypeId_'+ui.draggable.children('.first-child').text());
        // pricingTypeRow.addClass('pricingSeqOperation');
        // var pricingTypeCol =
        // $('<td>').addClass('pricingTypeCol').append(ui.draggable.children('.pricing-type').text());
        // var pricingTypeIdHid=
        // $('<input>').addClass("pricingTypeIdHid").attr("type",
        // "hidden").attr("value",ui.draggable.children('.first-child').text());
        // pricingTypeCol.append(pricingTypeIdHid);
        // pricingTypeRow.append(pricingTypeCol);
        // var targetCol =
        // $('<td>').addClass('targetCol').append(ui.draggable.children('.pricing-target').text()+"
        // <a href='#' class='fright
        // deletePricingTypeRow'><img
        // src='../../resources/images/delete-node.png'
        // alt='delete row'
        // class='deleteSeqEditRow'/></a>");
        // pricingTypeRow.append(targetCol);
        // pricingTypeRow.prependTo(this);
        dropOperationPricingTypeSeq(this, ui, rowId);
      },
    });
    return false;
  });

  function dropOperationPricingTypeSeq(selTr, ui, rowId) {
    var pricingTypeRowNew = $("<tr>");
    pricingTypeRowNew.attr(
      "id",
      "pricingTypeId_" +
        ui.draggable.children(".first-child").text() +
        "_" +
        rowId
    );
    pricingTypeRowNew.addClass("pricingSeqOperation");
    var pricingTypeCol = $("<td>")
      .addClass("pricingTypeCol")
      .append(ui.draggable.children(".pricing-type").text());
    pricingTypeRowNew.attr("newRow", "true");
    if (rowId != undefined) {
      pricingTypeRowNew.attr("seqId", "pricingSeqId_" + rowId);
    }

    pricingTypeRowNew.append(pricingTypeCol);
    var targetCol = $("<td>")
      .addClass("targetCol")
      .append(
        ui.draggable.children(".pricing-target").text() +
          " <a href='#' class='fright deletePricingTypeRow'><img src='../../resources/images/delete-node.png' alt='delete row' class='deleteSeqEditRow'/></a>"
      );
    var pricingTypeIdHid = $("<input>")
      .addClass("pricingTypeIdHid_" + rowId)
      .attr("type", "hidden")
      .attr("value", ui.draggable.children(".first-child").text());
    pricingTypeRowNew.append(pricingTypeIdHid);
    pricingTypeRowNew.append(targetCol);
    pricingTypeRowNew.prependTo(selTr);
  }

  /*----- Drag and drop from tables ------ */

  $("#customerRecordsTable tbody tr").live("mouseover", function () {
    $(this).draggable({
      appendTo: "body",
      helper: "clone",
      zIndex: 20,
    });
  });
  $("#productsRecordTable tbody tr").live("mouseover", function () {
    $(this).draggable({
      appendTo: "body",
      helper: "clone",
      zIndex: 20,
    });
  });

  /*------- Hover the filter data----------*/
  $(".filterLink").live({
    mouseover: function () {
      $(this).siblings(".hoverData").show();
    },
    mouseout: function () {
      $(this).siblings(".hoverData").hide();
    },
  });

  /*reset the default settings*/
  $("#resetDefaultSettings").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#confirmDeleteSettings").fadeIn("fast");
  });
  $("#confirmDeleteSettings input.resetSettings").live("click", function () {
    var url = "/configuration/reset-default-settings";
    jQuery.ajax({
      type: "POST",
      url: url,
      success: function (str) {
        $("#confirmDeleteSettings").fadeOut("fast");
        $(location).attr("href", "/master-data");
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while resetting");
      },
    });
  });

  function loadUIAdjustmentData(adjustment) {
    var unid =
      typeof adjustment["unid"] != "undefined" ? adjustment["unid"] : "";
    var objectType =
      typeof adjustment["objectType"] != "undefined"
        ? adjustment["objectType"]
        : "";
    var objectName =
      typeof adjustment["objectName"] != "undefined"
        ? adjustment["objectName"]
        : "";
    var organizationId =
      typeof adjustment["organizationId"] != "undefined"
        ? adjustment["organizationId"]
        : "";
    var organizationName =
      typeof adjustment["organizationName"] != "undefined"
        ? adjustment["organizationName"]
        : "";
    var prcTypeDesc =
      typeof adjustment["prcTypeDesc"] != "undefined"
        ? adjustment["prcTypeDesc"]
        : "";
    var amount =
      typeof adjustment["amount"] != "undefined" ? adjustment["amount"] : "";
    display = "visible";
    if ($("#ADJ_UNID").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }

    var body = $("<tr>").attr("id", "adj_" + unid);
    var unidEle = $('<td style="display:' + display + '">')
      .addClass("first-child")
      .append(unid);

    if ($("#ADJ_TYPE").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var objectTypeEle = $('<td style="display:' + display + '">').append(
      objectType
    );
    if ($("#ADJ_OBJECT_NAME").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var objectNameEle = $('<td style="display:' + display + '">').append(
      objectName
    );
    if ($("#ADJ_ORG_ID").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var orgidEle = $('<td style="display:' + display + '">').append(
      organizationId
    );
    if ($("#ADJ_ORG_NAME").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var orgNameEle = $('<td style="display:' + display + '">').append(
      organizationName
    );
    if ($("#ADJ_PRICING_TYPE").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var prcTypeDescEle = $('<td style="display:' + display + '">').append(
      prcTypeDesc
    );
    if ($("#ADJ_AMOUNT").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var amountEle = $('<td style="display:' + display + '">').append(amount);
    var editImage = $("<img>").attr("src", "resources/images/editRow.png");
    var deleteImage = $("<img>").attr("src", "resources/images/deleteRow.png");
    var editEleContent = $("<a>")
      .attr("href", "")
      .addClass("editRowLink")
      .append(editImage);
    var deleteEleContent = $("<a>")
      .attr("href", "")
      .addClass("deleteRowLink")
      .append(deleteImage);
    var lastEle = $("<td>")
      .addClass("last-child")
      .append(editEleContent)
      .append(deleteEleContent);
    body.append(unidEle);
    body.append(objectTypeEle);
    body.append(objectNameEle);
    body.append(orgidEle);
    body.append(orgNameEle);
    body.append(prcTypeDescEle);
    body.append(amountEle);
    body.append(lastEle);

    $("#adjTable").append(body);
  }

  function loadHiddenAdjustment(adjustment) {
    var unid =
      typeof adjustment["unid"] != "undefined" ? adjustment["unid"] : "";
    var objectType =
      typeof adjustment["objectType"] != "undefined"
        ? adjustment["objectType"]
        : "";
    var objectName =
      typeof adjustment["objectName"] != "undefined"
        ? adjustment["objectName"]
        : "";
    var organizationId =
      typeof adjustment["organizationId"] != "undefined"
        ? adjustment["organizationId"]
        : "";
    var organizationName =
      typeof adjustment["organizationName"] != "undefined"
        ? adjustment["organizationName"]
        : "";
    var pricingTypeId =
      typeof adjustment["pricingTypeId"] != "undefined"
        ? adjustment["pricingTypeId"]
        : "";
    var amount =
      typeof adjustment["amount"] != "undefined" ? adjustment["amount"] : "";
    var rangeType =
      typeof adjustment["rangeType"] != "undefined"
        ? adjustment["rangeType"]
        : "";
    var lowRange =
      typeof adjustment["lowRange"] != "undefined"
        ? adjustment["lowRange"]
        : "";
    var highRange =
      typeof adjustment["highRange"] != "undefined"
        ? adjustment["highRange"]
        : "";
    var commentText =
      typeof adjustment["commentText"] != "undefined"
        ? adjustment["commentText"]
        : "";
    var startDate =
      typeof adjustment["startDate"] != "undefined"
        ? adjustment["startDate"]
        : "";
    var endDate =
      typeof adjustment["endDate"] != "undefined" ? adjustment["endDate"] : "";
    var customerName =
      typeof adjustment["customerName"] != "undefined"
        ? adjustment["customerName"]
        : "";
    var customerId =
      typeof adjustment["customerId"] != "undefined"
        ? adjustment["customerId"]
        : "";
    var objectId =
      typeof adjustment["objectNameId"] != "undefined"
        ? adjustment["objectNameId"]
        : "";

    var body = $("<div>").attr("id", "val_adj_" + unid);
    var startDateEle = $("<span>").addClass("adjStartDate").append(startDate);
    var endDateEle = $("<span>").addClass("adjEndDate").append(endDate);
    var unidEle = $("<span>").addClass("adjUnid").append(unid);
    var amountEle = $("<span>").addClass("adjAmount").append(amount);
    var objectTypeEle = $("<span>")
      .addClass("adjObjectType")
      .append(objectType);
    var adjOrgIdsEle = $("<span>").addClass("adjOrgIds").append(organizationId);
    var pricingTypeIdEle = $("<span>")
      .addClass("adjPricingTypeId")
      .append(pricingTypeId);
    var rangeTypeEle = $("<span>").addClass("adjRangeType").append(rangeType);
    var lowRangeEle = $("<span>").addClass("adjLowRange").append(lowRange);
    var highRangeEle = $("<span>").addClass("adjHighRange").append(highRange);
    var commentTextEle = $("<span>")
      .addClass("adjCommentText")
      .append(commentText);
    var custNameEle = $("<span>").addClass("adjCustName").append(customerName);
    var custIdEle = $("<span>").addClass("adjCustId").append(customerId);
    var orgnizationNameEle = $("<span>")
      .addClass("adjOrgs ")
      .append(organizationName);
    var objectNameEle = $("<span>")
      .addClass("adjProdGroups")
      .append(objectName);
    var objectIdEle = $("<span>").addClass("adjProdGroupIds").append(objectId);

    body
      .append(custNameEle)
      .append(custIdEle)
      .append(objectNameEle)
      .append(objectIdEle);
    body
      .append(startDateEle)
      .append(endDateEle)
      .append(unidEle)
      .append(amountEle);
    body
      .append(objectTypeEle)
      .append(orgnizationNameEle)
      .append(pricingTypeIdEle)
      .append(adjOrgIdsEle);
    body
      .append(rangeTypeEle)
      .append(lowRangeEle)
      .append(highRangeEle)
      .append(commentTextEle);
    $("#adjustmentDetails").append(body);
  }

  function loadUIProductData(product) {
    var unid = typeof product["unid"] != "undefined" ? product["unid"] : "";
    var customerName =
      typeof product["customerName"] != "undefined"
        ? product["customerName"]
        : "";
    var endDate =
      typeof product["endDate"] != "undefined" ? product["endDate"] : "";
    var organizationId =
      typeof product["organizationId"] != "undefined"
        ? product["organizationId"]
        : "";
    var organizationName =
      typeof product["organizationName"] != "undefined"
        ? product["organizationName"]
        : "";
    var masterName =
      typeof product["masterName"] != "undefined" ? product["masterName"] : "";
    var productGroupName =
      typeof product["productGroupName"] != "undefined"
        ? product["productGroupName"]
        : "";
    var startDate =
      typeof product["startDate"] != "undefined" ? product["startDate"] : "";
    display = "visible";
    if ($("#PROD_ORG_ID").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var body = $("<tr>").attr("id", "prod_" + unid);
    var orgidEle = $('<td style="display:' + display + '">')
      .addClass("first-child org-id")
      .append(organizationId);
    if ($("#PROD_ORG_NAME").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var orgNameEle = $('<td style="display:' + display + '">')
      .addClass("product-name")
      .append(organizationName);
    if ($("#PROD_CUSTOMER_NAME").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var custNameEle = $('<td style="display:' + display + '">').append(
      customerName
    );
    if ($("#PROD_MASTER_NAME").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var masterNameEle = $('<td style="display:' + display + '">').append(
      masterName
    );
    if ($("#PROD_GROUP_NAME").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var prodGrpNameEle = $('<td style="display:' + display + '">').append(
      productGroupName
    );
    var editImage = $("<img>").attr("src", "resources/images/editRow.png");
    var deleteImage = $("<img>").attr("src", "resources/images/deleteRow.png");
    var editEleContent = $("<a>")
      .attr("href", "")
      .addClass("editRowLink")
      .append(editImage);
    var deleteEleContent = $("<a>")
      .attr("href", "")
      .addClass("deleteRowLink")
      .append(deleteImage);
    var lastEle = $("<td>")
      .addClass("last-child")
      .append(editEleContent)
      .append(deleteEleContent);
    body.append(orgidEle);
    body.append(orgNameEle);
    body.append(custNameEle);
    body.append(masterNameEle);
    body.append(prodGrpNameEle);
    body.append(lastEle);
    $("#prodTable").append(body);
  }

  function loadProductHiddenData(product) {
    var unid = typeof product["unid"] != "undefined" ? product["unid"] : "";
    var customerName =
      typeof product["customerName"] != "undefined"
        ? product["customerName"]
        : "";
    var startDate =
      typeof product["startDate"] != "undefined" ? product["startDate"] : "";
    var endDate =
      typeof product["endDate"] != "undefined" ? product["endDate"] : "";
    var organizationId =
      typeof product["organizationId"] != "undefined"
        ? product["organizationId"]
        : "";
    var organizationName =
      typeof product["organizationName"] != "undefined"
        ? product["organizationName"]
        : "";
    var masterName =
      typeof product["masterName"] != "undefined" ? product["masterName"] : "";
    var productGroupName =
      typeof product["productGroupName"] != "undefined"
        ? product["productGroupName"]
        : "";
    var productGroupId =
      typeof product["productGroupId"] != "undefined"
        ? product["productGroupId"]
        : "";
    var commentText =
      typeof product["commentText"] != "undefined"
        ? product["commentText"]
        : "";

    var body = $("<div>").attr("id", "val_prod_" + unid);
    var startDateEle = $("<span>").addClass("prodStartDate").append(startDate);
    var endDateEle = $("<span>").addClass("prodEndDate").append(endDate);
    var unidEle = $("<span>").addClass("prodUnid").append(unid);
    var masterNameEle = $("<span>")
      .addClass("prodMasterPartName")
      .append(masterName);
    var custNameEle = $("<span>")
      .addClass("prodCustomerPartName")
      .append(customerName);
    var groupNameEle = $("<span>")
      .addClass("productGroups")
      .append(productGroupName);
    var groupIdEle = $("<span>").addClass("prodGroupId").append(productGroupId);
    var orgIdEle = $("<span>").addClass("prodOrgId").append(organizationId);
    var orgNameEle = $("<span>")
      .addClass("prodOrgName")
      .append(organizationName);

    var commentEle = $("<span>").addClass("prodComment").append(commentText);
    var extraCol = product.extraColumn;
    body
      .append(startDateEle)
      .append(endDateEle)
      .append(unidEle)
      .append(masterNameEle)
      .append(custNameEle);
    body
      .append(groupNameEle)
      .append(orgIdEle)
      .append(orgNameEle)
      .append(commentEle)
      .append(groupIdEle);
    //Add attributes to the hidden data
    $.each(extraCol, function () {
      var attrEle = $("<div>").addClass("prodAttributes");
      var colName = typeof this["name"] != "undefined" ? this["name"] : "";
      var colValue = typeof this["value"] != "undefined" ? this["value"] : "";
      attrEle.append($("<span>").addClass("attrName").append(colName));
      attrEle.append($("<span>").addClass("attrVal").append(colValue));
      body.append(attrEle);
    });
    $("#productDetails").append(body);
  }

  function loadCustomerHiddenData(customer) {
    var endDate =
      typeof customer["endDate"] != "undefined" ? customer["endDate"] : "";
    var groupId =
      typeof customer["groupId"] != "undefined" ? customer["groupId"] : "";
    var name = typeof customer["name"] != "undefined" ? customer["name"] : "";
    var startDate =
      typeof customer["startDate"] != "undefined" ? customer["startDate"] : "";
    var unid = typeof customer["unid"] != "undefined" ? customer["unid"] : "";
    var groupName =
      typeof customer["groupName"] != "undefined" ? customer["groupName"] : "";
    var id = typeof customer["id"] != "undefined" ? customer["id"] : "";
    var commentText =
      typeof customer["commentText"] != "undefined"
        ? customer["commentText"]
        : "";

    var body = $("<div>").attr("id", "val_cust_" + unid);
    var startDateEle = $("<span>").addClass("custStartDate").append(startDate);
    var endDateEle = $("<span>").addClass("custEndDate").append(endDate);
    var unidEle = $("<span>").addClass("custUnid").append(unid);
    var groupIdEle = $("<span>").addClass("custGroupId").append(groupId);
    var nameEle = $("<span>").addClass("custName").append(name);
    var groupNameEle = $("<span>").addClass("custGroupName").append(groupName);
    var idEle = $("<span>").addClass("custId").append(id);
    var commentEle = $("<span>").addClass("custComment").append(commentText);
    var extraCol = customer.extraColumn;
    body
      .append(startDateEle)
      .append(endDateEle)
      .append(unidEle)
      .append(groupIdEle);
    body.append(nameEle).append(groupNameEle).append(idEle).append(commentEle);
    //Add attributes to the hidden data
    $.each(extraCol, function () {
      var attrEle = $("<div>").addClass("custAttributes");
      var colName = typeof this["name"] != "undefined" ? this["name"] : "";
      var colValue = typeof this["value"] != "undefined" ? this["value"] : "";
      attrEle.append($("<span>").addClass("attrName").append(colName));
      attrEle.append($("<span>").addClass("attrVal").append(colValue));
      body.append(attrEle);
    });
    $("#customerDetails").append(body);
  }

  function loadUICustomerData(customer) {
    var endDate =
      typeof customer["endDate"] != "undefined" ? customer["endDate"] : "";
    var groupId =
      typeof customer["groupId"] != "undefined" ? customer["groupId"] : "";
    var name = typeof customer["name"] != "undefined" ? customer["name"] : "";
    var startDate =
      typeof customer["startDate"] != "undefined" ? customer["startDate"] : "";
    var unid = typeof customer["unid"] != "undefined" ? customer["unid"] : "";
    var groupName =
      typeof customer["groupName"] != "undefined" ? customer["groupName"] : "";

    var body = $("<tr>").attr("id", "cust_" + unid);
    display = "visible";
    if ($("#CUST_UNID").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var unidEle = $('<td style="display:' + display + '">')
      .addClass("first-child customer-id customerTableDataLayout")
      .attr("unid", "")
      .append(unid);
    if ($("#CUST_NAME").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var nameEle = $('<td style="display:' + display + '">')
      .addClass("customer-name customerTableDataLayout")
      .attr("unid", "")
      .append(name);
    if ($("#CUST_GROUP_ID").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var groupIdEle = $('<td style="display:' + display + '">')
      .addClass("customerTableDataLayout")
      .attr("unid", "")
      .append(groupId);
    if ($("#CUST_GROUP_NAME").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var groupNameEle = $('<td style="display:' + display + '">')
      .addClass("customerTableDataLayout customerOrganizationName")
      .attr("unid", "")
      .append(groupName);
    if ($("#CUST_START_DATE").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var startDateEle = $('<td style="display:' + display + '">')
      .addClass("customerTableDataLayout")
      .attr("unid", "")
      .append(startDate);
    if ($("#CUST_END_DATE").is(":visible") == true) {
      display = "visible";
    } else {
      display = "none";
    }
    var endDateEle = $('<td style="display:' + display + '">')
      .addClass("customerTableDataLayout")
      .attr("unid", "")
      .append(endDate);
    var editImage = $("<img>").attr("src", "resources/images/editRow.png");
    var deleteImage = $("<img>").attr("src", "resources/images/deleteRow.png");
    var editEleContent = $("<a>")
      .attr("href", "")
      .addClass("editRowLink")
      .append(editImage);
    var deleteEleContent = $("<a>")
      .attr("href", "")
      .addClass("deleteRowLink")
      .append(deleteImage);
    var lastEle = $("<td>")
      .addClass("last-child")
      .append(editEleContent)
      .append(deleteEleContent);
    body
      .append(unidEle)
      .append(nameEle)
      .append(groupIdEle)
      .append(groupNameEle);
    body.append(startDateEle).append(endDateEle).append(lastEle);
    $("#custTable").append(body);
  }

  function loadFilters(params, divFor) {
    $("#" + divFor + "FilterList").html("");
    $.each(params, function (iterator, param) {
      if (iterator < 5) {
        var list = $("<li>");
        var name = $("<a>")
          .attr({
            href: "",
            style: "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",
          })
          .addClass("filterLink " + divFor + "FilterName")
          .append(param.name);
        var id = $("<span>")
          .attr("style", "display: none")
          .addClass(divFor + "FilterId")
          .append(param.id);
        var reqData = $("<div>")
          .attr("style", "display: none")
          .addClass(divFor + "FilterReqData hoverData")
          .append(param.reqData);
        list.append(name).append(id).append(reqData);
        $("#" + divFor + "FilterList").append(list);
      }
      if (iterator >= 5) {
        if (iterator == 5) {
          var seeMore = $("<li>").addClass("seeAllFilterLink");
          var seeMoreLink = $("<a>")
            .attr("href", "")
            .addClass("seeMoreLink")
            .append("See More");
          var uList = $("<ul>").addClass(
            "allFiltersList " + divFor + "AllFilterList"
          );
          $("." + divFor + "AllFilterList").html("");
          seeMore.append(seeMoreLink).append(uList);
          $("#" + divFor + "FilterList").append(seeMore);
        }
        var list = $("<li>");
        var name = $("<a>")
          .attr({
            href: "",
            style: "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",
          })
          .addClass("filterLink " + divFor + "FilterName")
          .append(param.name);
        var id = $("<span>")
          .attr("style", "display: none")
          .addClass(divFor + "FilterId")
          .append(param.id);
        var reqData = $("<div>")
          .attr("style", "display: none")
          .addClass(divFor + "FilterReqData hoverData")
          .append(param.reqData);
        list.append(name).append(id).append(reqData);
        $("." + divFor + "AllFilterList").append(list);
      }
    });
  }

  function loadAllCustomerData(customers) {
    $("#custTable").html("");
    $("#customerDetails").html("");
    $.each(customers, function () {
      loadCustomerHiddenData(this);
      loadUICustomerData(this);
    });
    resetDraggable();
  }

  function loadCustAttributeData(attribute) {
    var columnName =
      typeof attribute["columnName"] != "undefined"
        ? attribute["columnName"]
        : "";
    var type =
      typeof attribute["columnType"] != "undefined"
        ? attribute["columnType"]
        : "";
    var description =
      typeof attribute["description"] != "undefined"
        ? attribute["description"]
        : "";
    var unid = typeof attribute["unid"] != "undefined" ? attribute["unid"] : "";
    var body = $("<tr>").attr("id", "cust_attr" + unid);
    var custUnid = $("<td>").addClass("first-child cust-add-unid").append(unid);
    var custDescription = $("<td>")
      .addClass("customerAttributeName")
      .append(description);
    var custColumnName = $("<td>").append(columnName);
    var custType = $("<td>").append(type);
    var deleteImage = $("<img>").attr("src", "resources/images/deleteRow.png");
    var deleteContent = $("<a>")
      .attr("href", "")
      .addClass("deleteRowLink deleteCustomerAttribute")
      .append(deleteImage);
    var lastElement = $("<td>").addClass("last-child").append(deleteContent);
    body
      .append(custUnid)
      .append(custDescription)
      .append(custColumnName)
      .append(custType)
      .append(lastElement);
    $("#customerAttributeDisplay").append(body);
  }

  function loadProAttributeData(attribute) {
    var columnName =
      typeof attribute["columnName"] != "undefined"
        ? attribute["columnName"]
        : "";
    var type =
      typeof attribute["columnType"] != "undefined"
        ? attribute["columnType"]
        : "";
    var description =
      typeof attribute["description"] != "undefined"
        ? attribute["description"]
        : "";
    var unid = typeof attribute["unid"] != "undefined" ? attribute["unid"] : "";
    var body = $("<tr>").attr("id", "pro_attr" + unid);
    var custUnid = $("<td>").addClass("first-child pro-add-unid").append(unid);
    var custDescription = $("<td>")
      .addClass("productAttributeName")
      .append(description);
    var custColumnName = $("<td>").append(columnName);
    var custType = $("<td>").append(type);
    var deleteImage = $("<img>").attr("src", "resources/images/deleteRow.png");
    var deleteContent = $("<a>")
      .attr("href", "")
      .addClass("deleteRowLink deleteProductAttribute")
      .append(deleteImage);
    var lastElement = $("<td>").addClass("last-child").append(deleteContent);
    body
      .append(custUnid)
      .append(custDescription)
      .append(custColumnName)
      .append(custType)
      .append(lastElement);
    $("#productAttributeDisplay").append(body);
  }

  function loadAllAdjustment(adjustments) {
    $("#adjTable").html("");
    $("#adjustmentDetails").html("");
    $.each(adjustments, function () {
      loadHiddenAdjustment(this);
      loadUIAdjustmentData(this);
    });
  }

  function loadAllProductData(products) {
    $("#prodTable").html("");
    $("#productDetails").html("");
    $.each(products, function () {
      loadProductHiddenData(this);
      loadUIProductData(this);
    });
    resetDraggable();
  }

  function loadAllCustomerAttributeData(attribute) {
    $("#customerAttributeDisplay").html("");
    $.each(attribute, function () {
      loadCustAttributeData(this);
    });
    resetDraggable();
  }
  function loadAllProductAttributeData(attribute) {
    $("#productAttributeDisplay").html("");
    $.each(attribute, function () {
      loadProAttributeData(this);
    });
    resetDraggable();
  }

  $("#productsRecordTable .first-page").live("click", function () {
    var sIndex = $(".productPaginationData span.startIndex").text();
    if (sIndex == 1 && isPagination) {
      return false;
    }
    var startIndex = 1;
    var endIndex = productRecordsPerPage;
    var totalRecords = endIndex - startIndex + 1;
    if ($("#prodSearch .inputText").attr("search") == "on") {
      var params = {
        searchStr: $("#prodSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
      };
      loadProductSearchData(params);
      $("#productsRecordTable span.pageNum").text(1);
      return false;
    }
    if ($("#newProductFilter").attr("search") == "on") {
      params = productAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadProductAdvanceSearchData(params);
      $("#productsRecordTable span.pageNum").text(1);
      return false;
    }
    getProductFirstPage(true);
    return false;
  });

  $("#productsRecordTable .last-page").live("click", function () {
    var currentPage = $("#productsRecordTable span.pageNum").text();
    var lastPage = $("#productsRecordTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    if ($("#prodSearch .inputText").attr("search") == "on") {
      var endIndex = parseInt(lastPage) * productRecordsPerPage;
      var startIndex = endIndex - productRecordsPerPage + 1;
      var totalRecords = endIndex - startIndex + 1;
      var params = {
        searchStr: $("#prodSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
      };
      loadProductSearchData(params);
      $("#productsRecordTable span.pageNum").text(lastPage);
      return false;
    }
    if ($("#newProductFilter").attr("search") == "on") {
      params = productAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadProductAdvanceSearchData(params);
      $("#productsRecordTable span.pageNum").text(lastPage);
      return false;
    }
    getProductLastPage();
    return false;
  });

  /* Add CUstomer Attribute */
  $("#addCustomerAttribute").live("click", function () {
    if (validation("customerAttributeForm")) {
      var type = "4";
      if ($("input#attributeNumeric").is(":checked") == true) {
        type = "4";
      } else if ($("input#attributeString").is(":checked") == true) {
        type = "5";
      }
      var params = {
        description: $(
          "#customerAttributeForm input#customerColumnDescription"
        ).val(),
        columnName: $("#customerAttributeForm input#custColumnName").val(),
        type: type,
      };
      var url = "/customer-attribute/add";
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          //display UI data and hidden data
          popSuccessMessage(str.baseResponse.message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getCustomerAttributeFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while addind the customer attribute.");
        },
      });
      $(".validationMsg").hide();
      $("#customerAttributeForm")[0].reset();
    }
  });

  /*----- Add the Product Attribute ------------*/
  $("#addProductAttribute").live("click", function () {
    if (validation("createProductAttributeForm")) {
      var type = "1";
      if ($("input#productAttributeNumeric").is(":checked") == true) {
        type = "1";
      } else if ($("input#productAttributeString").is(":checked") == true) {
        type = "2";
      } else {
        popAlert(" Please select either Numeric or String ");
      }
      var params = {
        description: $(
          "#createProductAttributeForm input#productColumnDescription"
        ).val(),
        columnName: $(
          "#createProductAttributeForm input#productColumnName"
        ).val(),
        type: type,
      };
      var url = "/product-attribute/add";
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          //display UI data and hidden data
          popSuccessMessage(str.baseResponse.message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getProductAttributeFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while adding the product attribute.");
        },
      });
      $(".validationMsg").hide();
      $("#createProductAttributeForm")[0].reset();
    }
  });
  $("#productsRecordTable .next").live("click", function () {
    //create params
    var currentPage = $("#productsRecordTable span.pageNum").text();
    var lastPage = $("#productsRecordTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var startIndex = $(".productPaginationData span.endIndex").text();
    startIndex = parseInt(startIndex) + 1;
    var endIndex = startIndex + productRecordsPerPage - 1;
    var sortCol = $(".productPaginationData span.sortCol").text();
    var sortDir = $(".productPaginationData span.sortDir").text();
    var totalRecords = endIndex - startIndex + 1;
    if ($("#prodSearch .inputText").attr("search") == "on") {
      var params = {
        searchStr: $("#prodSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
      };
      loadProductSearchData(params);
      $("#productsRecordTable span.pageNum").text(parseInt(currentPage) + 1);
      return false;
    }
    if ($("#newProductFilter").attr("search") == "on") {
      params = productAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadProductAdvanceSearchData(params);
      $("#productsRecordTable span.pageNum").text(parseInt(currentPage) + 1);
      return false;
    }
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadProductData(params);
    $("#productsRecordTable span.pageNum").text(parseInt(currentPage) + 1);
    return false;
  });

  $("#productsRecordTable .prev").live("click", function () {
    //create params
    var endIndex = $(".productPaginationData span.startIndex").text();
    if (endIndex == 1) {
      return false;
    }
    endIndex = parseInt(endIndex) - 1;
    var startIndex = endIndex - productRecordsPerPage + 1;
    var sortCol = $(".productPaginationData span.sortCol").text();
    var sortDir = $(".productPaginationData span.sortDir").text();
    var totalRecords = endIndex - startIndex + 1;
    if ($("#prodSearch .inputText").attr("search") == "on") {
      var params = {
        searchStr: $("#prodSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
      };
      loadProductSearchData(params);
      var currentPage = $("#productsRecordTable span.pageNum").text();
      $("#productsRecordTable span.pageNum").text(parseInt(currentPage) - 1);
      return false;
    }
    if ($("#newProductFilter").attr("search") == "on") {
      params = productAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadProductAdvanceSearchData(params);
      var currentPage = $("#productsRecordTable span.pageNum").text();
      $("#productsRecordTable span.pageNum").text(parseInt(currentPage) - 1);
      return false;
    }
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadProductData(params);
    var currentPage = $("#productsRecordTable span.pageNum").text();
    $("#productsRecordTable span.pageNum").text(parseInt(currentPage) - 1);
    return false;
  });

  function getProductLastPage() {
    var currentPage = $("#productsRecordTable span.pageNum").text();
    var lastPage = $("#productsRecordTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var sortCol = $(".productPaginationData span.sortCol").text();
    var sortDir = $(".productPaginationData span.sortDir").text();
    var lastPage = $("#productsRecordTable span.totalPage").text();
    var endIndex = parseInt(lastPage) * productRecordsPerPage;
    var startIndex = endIndex - productRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadProductData(params);
    $("#productsRecordTable span.pageNum").text(lastPage);
  }

  function getProductFirstPage(isPagination) {
    var sIndex = $(".productPaginationData span.startIndex").text();
    if (sIndex == 1 && isPagination) {
      return false;
    }
    if (typeof params == "undefined") {
      params = {};
    }
    var sortCol = $(".productPaginationData span.sortCol").text();
    var sortDir = $(".productPaginationData span.sortDir").text();
    var startIndex = 1;
    var endIndex = productRecordsPerPage;
    params["startIndex"] = startIndex;
    params["endIndex"] = endIndex;
    params["sortCol"] = sortCol;
    params["sortDir"] = sortDir;
    loadProductData(params);
    $("#productsRecordTable span.pageNum").text(1);
  }

  $("#adjustmentRecordTable .first-page").live("click", function () {
    var sIndex = $(".adjustmentPaginationData span.startIndex").text();
    if (sIndex == 1) {
      return false;
    }
    var sortCol = $(".adjustmentPaginationData span.sortCol").text();
    var sortDir = $(".adjustmentPaginationData span.sortDir").text();
    var startIndex = 1;
    var endIndex = adjustmentRecordsPerPage;
    var totalRecords = endIndex - startIndex + 1;
    if ($("#adjSearch .inputText").attr("search") == "on") {
      var params = {
        searchStr: $("#adjSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
        sortCol: sortCol,
        sortDir: sortDir,
      };
      loadAdjustmentSearchData(params);
      $("#adjustmentRecordTable span.pageNum").text(parseInt(1));
      return false;
    }
    if ($("#adjustmentNewFilter").attr("search") == "on") {
      var params = adjustmentAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadAdjustmentAdvanceSearch(params);
      $("#adjustmentRecordTable span.pageNum").text(parseInt(1));
      return false;
    }
    getAdjustmentFirstPage(true);
    return false;
  });

  $("#adjustmentRecordTable .last-page").live("click", function () {
    var currentPage = $("#adjustmentRecordTable span.pageNum").text();
    var lastPage = $("#adjustmentRecordTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var lastPage = $("#adjustmentRecordTable span.totalPage").text();
    var sortCol = $(".adjustmentPaginationData span.sortCol").text();
    var sortDir = $(".adjustmentPaginationData span.sortDir").text();
    var endIndex = parseInt(lastPage) * adjustmentRecordsPerPage;
    var startIndex = endIndex - adjustmentRecordsPerPage + 1;
    var totalRecords = endIndex - startIndex + 1;
    if ($("#adjSearch .inputText").attr("search") == "on") {
      var params = {
        searchStr: $("#adjSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
        sortCol: sortCol,
        sortDir: sortDir,
      };
      loadAdjustmentSearchData(params);
      $("#adjustmentRecordTable span.pageNum").text(parseInt(lastPage));
      return false;
    }
    if ($("#adjustmentNewFilter").attr("search") == "on") {
      var params = adjustmentAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadAdjustmentAdvanceSearch(params);
      $("#adjustmentRecordTable span.pageNum").text(parseInt(lastPage));
      return false;
    }
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    getAdjustmentLastPage(params);
    return false;
  });

  $("#adjustmentRecordTable .next").live("click", function () {
    //create params
    var currentPage = $("#adjustmentRecordTable span.pageNum").text();
    var lastPage = $("#adjustmentRecordTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var startIndex = $(".adjustmentPaginationData span.endIndex").text();
    startIndex = parseInt(startIndex) + 1;
    var endIndex = startIndex + adjustmentRecordsPerPage - 1;
    var sortCol = $(".adjustmentPaginationData span.sortCol").text();
    var sortDir = $(".adjustmentPaginationData span.sortDir").text();
    var totalRecords = endIndex - startIndex + 1;
    if ($("#adjSearch .inputText").attr("search") == "on") {
      var params = {
        searchStr: $("#adjSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
        sortCol: sortCol,
        sortDir: sortDir,
      };
      loadAdjustmentSearchData(params);
      $("#adjustmentRecordTable span.pageNum").text(parseInt(currentPage) + 1);
      return false;
    }
    if ($("#adjustmentNewFilter").attr("search") == "on") {
      var params = adjustmentAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadAdjustmentAdvanceSearch(params);
      $("#adjustmentRecordTable span.pageNum").text(parseInt(currentPage) + 1);
      return false;
    }
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadAdjustmentData(params);
    $("#adjustmentRecordTable span.pageNum").text(parseInt(currentPage) + 1);
    return false;
  });

  $("#adjustmentRecordTable .prev").live("click", function () {
    //create params
    var endIndex = $(".adjustmentPaginationData span.startIndex").text();
    if (endIndex == 1) {
      return false;
    }
    endIndex = parseInt(endIndex) - 1;
    var startIndex = endIndex - adjustmentRecordsPerPage + 1;
    var sortCol = $(".adjustmentPaginationData span.sortCol").text();
    var sortDir = $(".adjustmentPaginationData span.sortDir").text();
    var totalRecords = endIndex - startIndex + 1;
    if ($("#adjSearch .inputText").attr("search") == "on") {
      var params = {
        searchStr: $("#adjSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
        sortCol: sortCol,
        sortDir: sortDir,
      };
      loadAdjustmentSearchData(params);
      var currentPage = $("#adjustmentRecordTable span.pageNum").text();
      $("#adjustmentRecordTable span.pageNum").text(parseInt(currentPage) - 1);
      return false;
    }
    if ($("#adjustmentNewFilter").attr("search") == "on") {
      var params = adjustmentAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadAdjustmentAdvanceSearch(params);
      var currentPage = $("#adjustmentRecordTable span.pageNum").text();
      $("#adjustmentRecordTable span.pageNum").text(parseInt(currentPage) - 1);
      return false;
    }
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadAdjustmentData(params);
    var currentPage = $("#adjustmentRecordTable span.pageNum").text();
    $("#adjustmentRecordTable span.pageNum").text(parseInt(currentPage) - 1);
    return false;
  });

  function getAdjustmentLastPage(params) {
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadAdjustmentData(params);
    $("#adjustmentRecordTable span.pageNum").text(lastPage);
  }

  function getAdjustmentFirstPage(isPagination, params) {
    var sIndex = $(".adjustmentPaginationData span.startIndex").text();
    if (sIndex == 1 && isPagination) {
      return false;
    }
    if (typeof params == "undefined") {
      params = {};
    }
    var sortCol = $(".adjustmentPaginationData span.sortCol").text();
    var sortDir = $(".adjustmentPaginationData span.sortDir").text();
    var startIndex = 1;
    var endIndex = adjustmentRecordsPerPage;
    params["startIndex"] = startIndex;
    params["endIndex"] = endIndex;
    params["sortCol"] = sortCol;
    params["sortDir"] = sortDir;
    loadAdjustmentData(params);
    $("#adjustmentRecordTable span.pageNum").text(1);
  }

  $("#productsRecordTable .sortable").live("click", function () {
    var sortDir = $(this).attr("sortDir");
    var sortCol = $(this).attr("sortCol");
    $(".productPaginationData span.sortCol").text(sortCol);
    $(".productPaginationData span.sortDir").text(sortDir);
    var params = { sortCol: sortCol, sortDir: sortDir };
    getProductFirstPage(false, params);
    var newSortDir = sortDir == "asc" ? "desc" : "asc";
    $(this).attr("sortDir", newSortDir);
  });

  $("#customerRecordTable .sortable").live("click", function () {
    var sortDir = $(this).attr("sortDir");
    var sortCol = $(this).attr("sortCol");
    $(".customerPaginationData span.sortCol").text(sortCol);
    $(".customerPaginationData span.sortDir").text(sortDir);
    var params = { sortCol: sortCol, sortDir: sortDir };
    getCustomerFirstPage(false, params);
    var newSortDir = sortDir == "asc" ? "desc" : "asc";
    $(this).attr("sortDir", newSortDir);
  });

  $("#adjustmentRecordTable .sortable").live("click", function () {
    var sortDir = $(this).attr("sortDir");
    var sortCol = $(this).attr("sortCol");
    $(".adjustmentPaginationData span.sortCol").text(sortCol);
    $(".adjustmentPaginationData span.sortDir").text(sortDir);
    var params = { sortCol: sortCol, sortDir: sortDir };
    getAdjustmentFirstPage(false, params);
    var newSortDir = sortDir == "asc" ? "desc" : "asc";
    $(this).attr("sortDir", newSortDir);
  });

  $("#customerRecordTable .first-page").live("click", function () {
    var sIndex = $(".customerPaginationData span.startIndex").text();
    if (sIndex == 1) {
      return false;
    }
    var startIndex = 1;
    var endIndex = customerRecordsPerPage;

    if ($("#custSearch .inputText").attr("search") == "on") {
      var totalRecords = endIndex - startIndex + 1;
      var params = {
        searchStr: $("#custSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
      };
      loadCustomerSearchData(params);
      $("#customerRecordTable span.pageNum").text(startIndex);
      return false;
    }
    if ($("#customerNewFilter").attr("search") == "on") {
      var totalRecords = endIndex - startIndex + 1;
      var params = customerAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadCustomerAdvanceSearchData(params);
      $("#customerRecordTable span.pageNum").text(parseInt(startIndex));
      return false;
    }
    getCustomerFirstPage(true);
    return false;
  });

  $("#customerRecordTable .last-page").live("click", function () {
    var currentPage = $("#customerRecordTable span.pageNum").text();
    var lastPage = $("#customerRecordTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var endIndex = parseInt(lastPage) * customerRecordsPerPage;
    var startIndex = endIndex - customerRecordsPerPage + 1;
    if ($("#custSearch .inputText").attr("search") == "on") {
      var totalRecords = endIndex - startIndex + 1;
      var params = {
        searchStr: $("#custSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
      };
      loadCustomerSearchData(params);
      $(".customerPaginationData span.startIndex").text(startIndex);
      $("#customerRecordTable span.pageNum").text(lastPage);
      return false;
    }
    if ($("#customerNewFilter").attr("search") == "on") {
      var totalRecords = endIndex - startIndex + 1;
      var params = customerAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadCustomerAdvanceSearchData(params);
      $("#customerRecordTable span.pageNum").text(parseInt(lastPage));
      return false;
    }
    getCustomerLastPage();
    return false;
  });

  function getCustomerLastPage() {
    var currentPage = $("#customerRecordTable span.pageNum").text();
    var lastPage = $("#customerRecordTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var sortCol = $(".customerPaginationData span.sortCol").text();
    var sortDir = $(".customerPaginationData span.sortDir").text();
    var lastPage = $("#customerRecordTable span.totalPage").text();
    var endIndex = parseInt(lastPage) * customerRecordsPerPage;
    var startIndex = endIndex - customerRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadCustomerData(params);
    $("#customerRecordTable span.pageNum").text(lastPage);
  }

  function getCustomerFirstPage(isPagination, params) {
    var sIndex = $(".customerPaginationData span.startIndex").text();
    if (sIndex == 1 && isPagination) {
      return false;
    }
    if (typeof params == "undefined") {
      params = {};
    }
    var sortCol = $(".customerPaginationData span.sortCol").text();
    var sortDir = $(".customerPaginationData span.sortDir").text();
    var startIndex = 1;
    var endIndex = customerRecordsPerPage;
    params["startIndex"] = startIndex;
    params["endIndex"] = endIndex;
    params["sortCol"] = sortCol;
    params["sortDir"] = sortDir;
    loadCustomerData(params);
    $("#customerRecordTable span.pageNum").text(startIndex);
  }

  $("#customerRecordTable .next").live("click", function () {
    //create params
    var currentPage = $("#customerRecordTable span.pageNum").text();
    var lastPage = $("#customerRecordTable span.totalPage").text();
    var sortCol = $(".customerPaginationData span.sortCol").text();
    var sortDir = $(".customerPaginationData span.sortDir").text();
    if (currentPage == lastPage) {
      return false;
    }
    var startIndex = $(".customerPaginationData span.endIndex").text();
    startIndex = parseInt(startIndex) + 1;
    var endIndex = startIndex + customerRecordsPerPage - 1;
    if ($("#custSearch .inputText").attr("search") == "on") {
      var totalRecords = endIndex - startIndex + 1;
      var params = {
        searchStr: $("#custSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
      };
      loadCustomerSearchData(params);
      $("#customerRecordTable span.pageNum").text(parseInt(currentPage) + 1);
      return false;
    }
    if ($("#customerNewFilter").attr("search") == "on") {
      var totalRecords = endIndex - startIndex + 1;
      var params = customerAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadCustomerAdvanceSearchData(params);
      $("#customerRecordTable span.pageNum").text(parseInt(currentPage) + 1);
      return false;
    }
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadCustomerData(params);
    $("#customerRecordTable span.pageNum").text(parseInt(currentPage) + 1);
    return false;
  });

  $("#customerRecordTable .prev").live("click", function () {
    //create params
    var endIndex = $(".customerPaginationData span.startIndex").text();
    var sortCol = $(".customerPaginationData span.sortCol").text();
    var sortDir = $(".customerPaginationData span.sortDir").text();
    if (endIndex == 1) {
      return false;
    }
    endIndex = parseInt(endIndex) - 1;
    var startIndex = endIndex - customerRecordsPerPage + 1;
    if ($("#custSearch .inputText").attr("search") == "on") {
      var totalRecords = endIndex - startIndex + 1;
      var params = {
        searchStr: $("#custSearch input.inputText").val(),
        startIndex: startIndex,
        endIndex: endIndex,
        totalRecords: totalRecords,
      };
      loadCustomerSearchData(params);
      var currentPage = $("#customerRecordTable span.pageNum").text();
      $("#customerRecordTable span.pageNum").text(parseInt(currentPage) - 1);
      return false;
    }
    if ($("#customerNewFilter").attr("search") == "on") {
      var totalRecords = endIndex - startIndex + 1;
      var params = customerAdvSearchParams;
      params.startIndex = startIndex;
      params.endIndex = endIndex;
      params.totalRecords = totalRecords;
      loadCustomerAdvanceSearchData(params);
      var currentPage = $("#customerRecordTable span.pageNum").text();
      $("#customerRecordTable span.pageNum").text(parseInt(currentPage) - 1);
      return false;
    }
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadCustomerData(params);
    var currentPage = $("#customerRecordTable span.pageNum").text();
    $("#customerRecordTable span.pageNum").text(parseInt(currentPage) - 1);
    return false;
  });

  function loadCustomerData(params) {
    var url = "/customers/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        $("span.noCustRecord").hide();
        if (str.customers.totalRecords == 0) {
          $("span.noCustRecord").show();
        }
        $("#totalCustomers").html(
          "Customers - showing " +
            str.customers.listSize +
            " of " +
            str.customers.totalRecords
        );
        var totalPages =
          str.customers.totalRecords / str.customers.tableRecords;
        $("#customerRecordTable span.totalPage").text(Math.ceil(totalPages));
        hidePagination("customerTablePagination");
        loadAllCustomerData(str.customers.customerList);
        $(".customerPaginationData span.startIndex").text(params.startIndex);
        $(".customerPaginationData span.endIndex").text(params.endIndex);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading customer data");
      },
    });
  }

  function loadAdjustmentData(params) {
    var url = "/adjustments/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        $("span.noAdjRecord").hide();
        if (str.adjustments.totalRecords == 0) {
          $("span.noAdjRecord").show();
        }
        $("#totalAdjustments").html(
          "Adjustments - showing " +
            str.adjustments.listSize +
            " of " +
            str.adjustments.totalRecords
        );
        var totalPages =
          str.adjustments.totalRecords / adjustmentRecordsPerPage;
        $("#adjustmentRecordTable span.totalPage").text(Math.ceil(totalPages));
        loadAllAdjustment(str.adjustments.adjustments);
        $(".adjustmentPaginationData span.startIndex").text(params.startIndex);
        $(".adjustmentPaginationData span.endIndex").text(params.endIndex);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading adjustment data");
      },
    });
  }

  function loadProductData(params) {
    var url = "/product/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        $("span.noProdRecord").hide();
        if (str.products.totalRecords == 0) {
          $("span.noProdRecord").show();
        }
        $("#totalProducts").html(
          "Products - showing " +
            str.products.listSize +
            " of " +
            str.products.totalRecords
        );
        var totalPages = str.products.totalRecords / productRecordsPerPage;
        $("#productsRecordTable span.totalPage").text(Math.ceil(totalPages));
        loadAllProductData(str.products.productList);
        hidePagination("productsTablePagination");
        $(".productPaginationData span.startIndex").text(params.startIndex);
        $(".productPaginationData span.endIndex").text(params.endIndex);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading product data");
      },
    });
  }

  function deleteNode(params) {
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response[0].message);
        $(".pageOverlay").fadeOut("fast");
        $(".popupWrapper").fadeOut("fast");
        location.reload();
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while deleting the hierarchy.");
      },
    });
  }

  function getFilters(url, divFor) {
    jQuery.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      success: function (str) {
        loadFilters(str.filters, divFor);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading filters.");
      },
    });
  }

  function deleteCustomer(params) {
    var url = "/customers/delete";
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response[0].message);
        $(".pageOverlay").fadeOut("fast");
        $(".popupWrapper").fadeOut("fast");
        getCustomerFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while deleting the customer.");
      },
    });
  }

  function deleteAdjustment(params) {
    var url = "/adjustments/delete";
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response[0].message);
        $(".pageOverlay").fadeOut("fast");
        $(".popupWrapper").fadeOut("fast");
        getAdjustmentFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while deleting the adjustment.");
      },
    });
  }

  function deleteProduct(params) {
    var url = "/product/delete";
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response[0].message);
        $(".pageOverlay").fadeOut("fast");
        $(".popupWrapper").fadeOut("fast");
        getProductFirstPage(false);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while deleting the product.");
      },
    });
  }

  function loadCustomerAttributesData(params) {
    var url = "/customer-attribute/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        $("#totalCustomerAttributes").html(
          "Customer Attributes - showing " +
            str.customerAttributes.listSize +
            " of " +
            str.customerAttributes.totalRecords
        );
        var totalPages =
          str.customerAttributes.totalRecords / custAttrRecordsPerPage;
        $("#CustomersAttributesTable span.totalPage").text(
          Math.ceil(totalPages)
        );
        loadAllCustomerAttributeData(str.customerAttributes.attributes);
        $(".customerAttrPaginationData span.startIndex").text(
          params.startIndex
        );
        $(".customerAttrPaginationData span.endIndex").text(params.endIndex);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading the customer attribute.");
      },
    });
  }

  function loadProductAttributeData(params) {
    var url = "/product-attribute/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        $("#totalProductAttributes").html(
          "Product Attributes - showing " +
            str.productAttributes.listSize +
            " of " +
            str.productAttributes.totalRecords
        );
        var totalPages =
          str.productAttributes.totalRecords / prodAttrRecordsPerPage;
        $("#ProductAttributesTable span.totalPage").text(Math.ceil(totalPages));
        loadAllProductAttributeData(str.productAttributes.attributes);
        $(".productAttrPaginationData span.startIndex").text(params.startIndex);
        $(".productAttrPaginationData span.endIndex").text(params.endIndex);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading the product attribute.");
      },
    });
  }

  $("#adjSearch .serachButton").live("click", function () {
    $("#adjustmentNewFilter").attr("search", "off");
    $(".adjustmentTableFiltersDisplayList").empty();
    $(".adjustmentTableFiltersDisplayList")
      .siblings()
      .children(".italicText")
      .text("");
    if (
      $("#adjSearch input.inputText").val() == "Enter Object Name to Search"
    ) {
      return false;
    }
    $("#adjSearch .inputText").attr("search", "on");
    var startIndex = parseInt(
      $(".adjustmentPaginationData span.startIndex").text()
    );
    var endIndex = parseInt(
      $(".adjustmentPaginationData span.endIndex").text()
    );
    var totalRecords = endIndex - startIndex + 1;
    var params = {
      searchStr: $("#adjSearch input.inputText").val(),
      startIndex: startIndex,
      endIndex: endIndex,
      totalRecords: totalRecords,
    };
    loadAdjustmentSearchData(params);
  });

  $("#prodSearch .serachButton").live("click", function () {
    $("#newProductFilter").attr("search", "off");
    $(".productsTableFiltersDisplayList").empty();
    $(".productsTableFiltersDisplayList")
      .siblings()
      .children(".italicText")
      .text("");
    if (
      $("#prodSearch input.inputText").val() ==
      "Enter CustomerPartName/MasterPartName to Search"
    ) {
      return false;
    }
    $("#prodSearch .inputText").attr("search", "on");
    var startIndex = parseInt(
      $(".productPaginationData span.startIndex").text()
    );
    var endIndex = parseInt($(".productPaginationData span.endIndex").text());
    var totalRecords = endIndex - startIndex + 1;
    var params = {
      searchStr: $("#prodSearch input.inputText").val(),
      startIndex: startIndex,
      endIndex: endIndex,
      totalRecords: totalRecords,
    };
    hidePagination("productsTablePagination");
    loadProductSearchData(params);
  });

  $("#savePricingSequence").live("click", function () {
    if (validation("pricingSeqRecordsTable")) {
      var url = "/pricing-sequence/add";
      var hidPricingId = $(
        ".pricingTypeIdHid_" + $(this).parents("tr").attr("id")
      );
      var selPricingTypeIds = "";
      hidPricingId.each(function (i) {
        selPricingTypeIds += $(this).val() + ",";
      });
      if (selPricingTypeIds.indexOf(",") >= 0) {
        selPricingTypeIds = selPricingTypeIds.substr(
          0,
          selPricingTypeIds.length - 1
        );
      }

      var params = {
        description: $(this)
          .parents("td")
          .siblings(".pricingSeqName")
          .children(".inputText")
          .val(),
        unid: $(this)
          .parents("td")
          .siblings(".first-child")
          .children(".inputText")
          .val(),
        pricingTypeIds: selPricingTypeIds,
      };
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          getPricingSeqFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while adding the pricing sequence.");
        },
      });
      $(".validationMsg").hide();
    }
  });

  $("#custSearch .serachButton").live("click", function () {
    $("#customerNewFilter").attr("search", "off");
    $(".customerTableFiltersDisplayList").empty();
    $(".customerTableFiltersDisplayList")
      .siblings()
      .children(".italicText")
      .text("");
    if ($("#custSearch input.inputText").val() == "Enter Name to Search") {
      return false;
    }
    $("#custSearch .inputText").attr("search", "on");
    $("#customerNewFilter").attr("search", "off");
    var startIndex = parseInt(
      $(".customerPaginationData span.startIndex").text()
    );
    var endIndex = parseInt($(".customerPaginationData span.endIndex").text());
    var totalRecords = endIndex - startIndex + 1;
    var params = {
      searchStr: $("#custSearch input.inputText").val(),
      startIndex: startIndex,
      endIndex: endIndex,
      totalRecords: totalRecords,
    };
    loadCustomerSearchData(params);
  });

  $("#custSearch a.genLink").live("click", function () {
    $("#custSearch .inputText").attr("search", "off");
    $("#custSearch input").val("Enter Name to search");
    $(".customerTableFiltersDisplayList").empty();
    $(".customerTableFiltersDisplayList")
      .siblings()
      .children(".italicText")
      .text("");
    getCustomerFirstPage(false);
    return false;
  });

  $("#adjSearch a.genLink").live("click", function () {
    $("#adjSearch input").val("Enter Object Name to Search");
    $("#adjSearch .inputText").attr("search", "off");
    getAdjustmentFirstPage(false);
    return false;
  });

  $("#prodSearch a.genLink").live("click", function () {
    $("#prodSearch .inputText").attr("search", "off");
    $(".productsTableFiltersDisplayList").empty();
    $(".productsTableFiltersDisplayList")
      .siblings()
      .children(".italicText")
      .text("");
    $("#prodSearch input").val(
      "Enter CustomerPartName/MasterPartName to Search"
    );
    getProductFirstPage(false);
    return false;
  });

  $("#customerRecordsTableDeletePopup input.delCustomer").live(
    "click",
    function () {
      var params = {
        unid: $("#customerRecordsTableDeletePopup span#delete-cust").text(),
      };
      deleteCustomer(params);
    }
  );

  $("#custEditDelete").live("click", function () {
    var params = { unid: $("#editCustomer input.custUnid").val() };
    deleteCustomer(params);
  });

  $("#adjustmentsRecordsTableDeletePopup input.delAdjustment").live(
    "click",
    function () {
      var params = {
        unid: $("#adjustmentsRecordsTableDeletePopup span#delete-adj").text(),
      };
      deleteAdjustment(params);
    }
  );

  $("#adjEditDelete").live("click", function () {
    var params = { unid: $("#editAdjustment td.adjUnid").html() };
    deleteAdjustment(params);
  });

  $("#productsRecordsTableDeletePopup input.delProduct").live(
    "click",
    function () {
      var params = {
        unid: $("#productsRecordsTableDeletePopup span#delete-prod").text(),
      };
      deleteProduct(params);
    }
  );

  $("#prodEditDelete").live("click", function () {
    var params = { unid: $("#editProduct td.prodUnid").val() };
    deleteProduct(params);
  });

  $("#createAdjustment .adjPricingTypeId").live("change", function () {
    var option = this.options[this.selectedIndex];
    var val = $(option).val();
    $("#pricingTypeOperationDropDown").val(val);
    $("#createAdjustment .adjOperation").html(
      $("#pricingTypeOperationDropDown option:selected").html()
    );
  });

  $("#editAdjustment .adjPricingTypeId").live("change", function () {
    var option = this.options[this.selectedIndex];
    var val = $(option).val();
    $("#pricingTypeOperationDropDown").val(val);
    $("#editAdjustment .adjOperation").html(
      $("#pricingTypeOperationDropDown option:selected").html()
    );
  });

  $("#productUpdate").live("click", function () {
    if (validation("editProduct") && validateNumeric("editProduct")) {
      var params = {
        unid: $("#editProduct td.prodUnid").text(),
        custPartName: $("#editProduct input.prodCustomerPartName").val(),
        masterPartName: $("#editProduct input.prodMasterPartName").val(),
        orgId: $("#editProduct input.prodOrgId").val(),
        orgName: $("#editProduct td.customerNameVal").text(),
        productId: $("#editProduct input.productGroups").attr("unid"),
        proStartDate: $("#editProduct input.prodStartDate").val(),
        proEndDate: $("#editProduct input.prodEndDate").val(),
        proCommentText: $("#editProduct textarea.prodComment").val(),
        attributeData: getAttrDatas("editProduct", "prodAttributes"),
      };
      var url = "/product/edit";
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getProductFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while updating the product.");
        },
      });
    }
  });

  /* Duplicate Product Record*/
  $("#productDuplicate").live("click", function () {
    if (validation("editProduct") && validateNumeric("editProduct")) {
      var params = {
        custPartName: $("#editProduct input.prodCustomerPartName").val(),
        masterPartName: $("#editProduct input.prodMasterPartName").val(),
        orgId: $("#editProduct input.prodOrgId").val(),
        productId: $("#editProduct input.productGroups").attr("unid"),
        proStartDate: $("#editProduct input.prodStartDate").val(),
        proEndDate: $("#editProduct input.prodEndDate").val(),
        proCommentText: $("#editProduct textarea.prodComment").val(),
        attributeData: getAttrDatas("editProduct", "prodAttributes"),
      };
      var url = "/product/add";
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage("Duplicate " + str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getProductFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while adding the product.");
        },
      });
    }
  });
  $("#customerUpdate").live("click", function () {
    if (validation("editCustomer") && validateNumeric("editCustomer")) {
      var params = {
        custUniqueId: $("#editCustomer input.custUnid").val(),
        custName: $("#editCustomer input.custName").val(),
        custGroups: $("#editCustomer input.custGroupId").attr("unid"),
        custStartDate: $("#editCustomer input.custStartDate").val(),
        custEndDate: $("#editCustomer input.custEndDate").val(),
        commentText: $("#editCustomer textarea.custComment").val(),
        custId: $("#editCustomer span.custId").text(),
        attributeData: getAttrDatas("editCustomer", "custAttributes"),
      };
      var url = "/customers/edit";
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getCustomerFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while updating the customer.");
        },
      });
    }
  });
  $("#editHierarchy").live("click", function () {
    $("#editNodeUnid").val($(".jstree-clicked").parent().attr("unid"));
    $("#editGroupName").val($(".jstree-clicked").text().substr(1));
    $("#editStartDate").val($(".jstree-clicked").parent().attr("startdate"));
    $("#editEndDate").val($(".jstree-clicked").parent().attr("enddate"));
    $("span.editTo").text($(".jstree-clicked").text());
  });

  $("#hierarchyUpdate").live("click", function () {
    if (validation("editGroups")) {
      var params = {
        unid: $("#editGroups input#editNodeUnid").val(),
        groupName: $("#editGroups input.editGroupName").val(),
        startDate: $("#editGroups input#editStartDate").val(),
        endDate: $("#editGroups input#editEndDate").val(),
        id: $(".jstree-clicked").parent().attr("id"),
        parentId: $(".jstree-clicked").parent().attr("parentid"),
      };
      var url = "/groups/organization/edit";
      var data = $(".jstree-clicked").parents(".hierarchyContainer").attr("id");
      if (data == "organizationContainer") {
        url = "/groups/organization/edit";
      } else {
        url = "/groups/product/edit";
      }
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          var data = $(".jstree-clicked")
            .parents(".hierarchyContainer")
            .attr("id");
          if (
            data == "organizationContainer" &&
            $(".hierarachy-Div>ul>li>a").hasClass("jstree-clicked")
          ) {
            $.jstree._reference($("#organizationHierarchy")).refresh(-1);
          }
          if (
            data == "productContainer" &&
            $(".hierarachy-Div>ul>li>a").hasClass("jstree-clicked")
          ) {
            $.jstree._reference($("#productHierarchy")).refresh(-1);
          }
          if (
            data == "organizationContainer" &&
            $(".hierarachy-Div>ul>li>a").hasClass("jstree-clicked") == false
          ) {
            $.jstree
              ._reference($("#organizationHierarchy"))
              .refresh(
                $(
                  'li[unid="' +
                    $(".jstree-clicked").parents().attr("parentId") +
                    '"]'
                )
              );
          } else {
            $.jstree
              ._reference($("#productHierarchy"))
              .refresh(
                $(
                  'li[unid="' +
                    $(".jstree-clicked").parents().attr("parentId") +
                    '"]'
                )
              );
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while updating hierarchies.");
        },
      });
      $("#editGroups span.validationMsg").hide();
      $("#editGroups")[0].reset();
    }
  });

  $("#updateAdjustment").live("click", function () {
    if (validation("editAdjustment")) {
      var params = {
        unid: $("#editAdjustment td.adjUnid").text(),
        amount: $("#editAdjustment input.adjAmount").val(),
        custId: $("#editAdjustment input.adjCustId").val(),
        orgs: $("#editAdjustment input.adjOrgs").attr("unid"),
        prodId: $("#editAdjustment input.adjProdId").val(),
        prodGroups: $("#editAdjustment input.adjProdGroups").attr("unid"),
        pricingTypeId: $("#editAdjustment .adjPricingTypeId").val(),
        rangeType: $("#editAdjustment .adjRangeType").val(),
        highRange: $("#editAdjustment input.adjHighRange").val(),
        lowRange: $("#editAdjustment input.adjLowRange").val(),
        startDate: $("#editAdjustment input.adjStartDate").val(),
        endDate: $("#editAdjustment input.adjEndDate").val(),
        comment: $("#editAdjustment textarea.adjComment").val(),
      };
      var url = "/adjustments/edit";
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getAdjustmentFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while updating the adjustment.");
        },
      });
    }
  });

  /* Duplicate Adjustment record */
  $("#adjustmentDuplicate").live("click", function () {
    if (validation("editAdjustment")) {
      var params = {
        amount: $("#editAdjustment input.adjAmount").val(),
        custId: $("#editAdjustment input.adjCustId").val(),
        orgs: $("#editAdjustment input.adjOrgs").attr("unid"),
        prodId: $("#editAdjustment input.adjProdId").val(),
        prodGroups: $("#editAdjustment input.adjProdGroups").attr("unid"),
        pricingTypeId: $("#editAdjustment .adjPricingTypeId").val(),
        rangeType: $("#editAdjustment .adjRangeType").val(),
        highRange: $("#editAdjustment input.adjHighRange").val(),
        lowRange: $("#editAdjustment input.adjLowRange").val(),
        startDate: $("#editAdjustment input.adjStartDate").val(),
        endDate: $("#editAdjustment input.adjEndDate").val(),
        comment: $("#editAdjustment textarea.adjComment").val(),
      };
      var url = "/adjustments/add";
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage("Duplicate " + str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getAdjustmentFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while adding the adjustment.");
        },
      });
    }
  });
  $("#addCustomer").live("click", function () {
    if (validation("createCustomer") && validateNumeric("createCustomer")) {
      var params = {
        custUniqueId: $("#createCustomer input#custUniqueId").val(),
        custName: $("#createCustomer input#custName").val(),
        custGroups: $("#createCustomer input#custGroups").attr("unid"),
        custStartDate: $("#createCustomer input#custStartDate").val(),
        custEndDate: $("#createCustomer input#custEndDate").val(),
        commentText: $("#createCustomer textarea#commentText").val(),
        attributeData: getAttrDatas("createCustomer", "custAttributes"),
      };
      var url = "/customers/add";
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getCustomerFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while adding the customer.");
        },
      });
    }
  });
  /* Customer Duplicate */
  $("#customerDuplicate").live("click", function () {
    if (validation("editCustomer")) {
      var params = {
        custUniqueId: "",
        custName: $("#editCustomer input.custName").val(),
        custGroups: $("#editCustomer input.custGroupId").attr("unid"),
        custStartDate: $("#editCustomer input.custStartDate").val(),
        custEndDate: $("#editCustomer input.custEndDate").val(),
        commentText: $("#editCustomer textarea.custComment").val(),
        attributeData: getAttrDatas("createCustomer", "custAttributes"),
      };
      jQuery.ajax({
        type: "POST",
        url: "/customers/add",
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage("Duplicate " + str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getCustomerFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while adding the customer.");
        },
      });
    }
  });

  /*-----  Recent Filters For Customers -----*/
  $(".customerFilterName").live("click", function () {
    //var url="/customers/adv-search";
    var startIndex = parseInt(
      $(".customerPaginationData span.startIndex").text()
    );
    var endIndex = parseInt($(".customerPaginationData span.endIndex").text());
    var totalRecords = endIndex - startIndex + 1;
    var params = {
      filterId: $(this).siblings(".customerFilterId").html(),
      filterName: $(this).html(),
      startIndex: startIndex,
      endIndex: endIndex,
      totalRecords: totalRecords,
    };
    loadCustomerAdvanceSearchData(params);
  });

  /*-------- Recent Filters For Adjustments -----*/
  $(".adjustmentFilterName").live("click", function () {
    //var url="/adjustments/adv-search";
    var startIndex = parseInt(
      $(".adjustmentPaginationData span.startIndex").text()
    );
    var endIndex = parseInt(
      $(".adjustmentPaginationData span.endIndex").text()
    );
    var totalRecords = endIndex - startIndex + 1;
    var params = {
      filterId: $(this).siblings(".adjustmentFilterId").html(),
      filterName: $(this).html(),
      startIndex: startIndex,
      endIndex: endIndex,
      totalRecords: totalRecords,
    };
    loadAdjustmentAdvanceSearch(params);
  });
  /*-------- Recent Filters For Products -----*/
  $(".productFilterName").live("click", function () {
    //var url="/product/adv-search";
    var startIndex = parseInt(
      $(".productPaginationData span.startIndex").text()
    );
    var endIndex = parseInt($(".productPaginationData span.endIndex").text());
    var totalRecords = endIndex - startIndex + 1;
    var params = {
      filterId: $(this).siblings(".productFilterId").html(),
      filterName: $(this).html(),
    };
    loadProductAdvanceSearchData(params);
  });
  /*-----------  Add GroupCombo   --------------*/
  $("#addGroupCombo").live("click", function () {
    if (
      validation("createGroupComboForm") &&
      $.isNumeric($("#createGroupComboForm input#groupPriority").val())
    ) {
      var type = "1";
      if (
        $("#createGroupComboForm input#groupOrganization").is(":checked") ==
        true
      ) {
        type = "1";
      } else if (
        $("#createGroupComboForm input#groupProduct").is(":checked") == true
      ) {
        type = "2";
      }
      var groupId = [];
      var modifier = [];
      $("#createGroupComboForm td.organizationId").each(function () {
        groupId.push($(this).parent().attr("id"));
        $(
          "#" + $(this).siblings().children().attr("id") + " option:selected"
        ).each(function () {
          modifier.push($(this).attr("value"));
        });
      });
      var url = "/group-combo/add";
      var params = {
        groupIds: groupId,
        modifiers: modifier,
        type: type,
        sequence: $("#createGroupComboForm input#groupPriority").val(),
        description: $("#createGroupComboForm input#groupName").val(),
        comment: $("#createGroupComboForm textarea#commentText").val(),
        generic: $("#addGenCustProduct").is(":checked") ? "true" : "false",
      };
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getGroupComboFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message form the Server
          popAlert("Error while adding the groupcombo.");
        },
      });
      $("#groupComboTypeTable tbody").empty();
      $("#createGroupComboForm")[0].reset();
    }
  });

  /*----------- Edit GroupCombo ---------*/
  $("#groupComboEdit").live("click", function () {
    if (validation("editGroupComboForm")) {
      var type = "1";
      if (
        $("#editGroupComboForm input#groupComboEditOrganization").is(
          ":checked"
        ) == true
      ) {
        type = "1";
      } else {
        type = "2";
      }
      var groupId = [];
      var modifier = [];
      $("#editGroupComboForm td.organizationId").each(function () {
        groupId.push($(this).parent().attr("id"));
        modifier.push(
          $(
            "#editGroupComboForm select#groupComboModifier" +
              $(this).parent().attr("id") +
              " option:selected"
          ).val()
        );
      });
      var url = "/group-combo/edit";
      var params = {
        unid: $("#editGroupComboForm td#gComboUnid").html(),
        description: $("#editGroupComboForm input#groupComboName").val(),
        groupIds: groupId,
        modifiers: modifier,
        sequence: $("#editGroupComboForm input#groupComboPriority").val(),
        type: type,
        comment: $("#editGroupComboForm textarea#commentText").val(),
        generic: $("#editGroupComboForm input#addGenCustProduct").is(":checked")
          ? "true"
          : "false",
      };
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getGroupComboFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message form the Server
          popAlert("Error while updating the groupcombo.");
        },
      });
      $(".groupComboTypeDivWrapper").removeClass("jstree-drop-product");
      $(".groupComboTypeDivWrapper").removeClass("jstree-drop-org");
      $("#groupComboTypeTable tbody").empty();
      //$('#editGroupComboForm')[0].reset();
    }
  });

  $("#addSiblingHir").live("click", function () {
    if (validation("addSiblingGroup") == true) {
      var params = {
        unid: $("#addSibling input#siblingUnid").val(),
        groupName: $("#addSibling input#siblingGroupName").val(),
        startDate: $("#addSibling input#siblingStartDate").val(),
        parentId: $(".jstree-clicked").parent().attr("parentId"),
        endDate: $("#addSibling input#siblingEndDate").val(),
      };
      var data = $(".jstree-clicked").parents(".hierarchyContainer").attr("id");
      if (data == "organizationContainer") {
        url = "/groups/organization/add-sibling";
      } else {
        url = "/groups/product/add-sibling";
      }
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          var data = $(".jstree-clicked")
            .parents(".hierarchyContainer")
            .attr("id");

          if (data == "organizationContainer") {
            $.jstree
              ._reference($("#organizationHierarchy"))
              .refresh(
                $(
                  'li[unid="' +
                    $(".jstree-clicked").parents().attr("parentId") +
                    '"]'
                )
              );
          } else {
            $.jstree
              ._reference($("#productHierarchy"))
              .refresh(
                $(
                  'li[unid="' +
                    $(".jstree-clicked").parents().attr("parentId") +
                    '"]'
                )
              );
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message form the Server
          popAlert("Error while adding the sibling group.");
        },
      });
      $("#addSiblingGroup")[0].reset();
      $("#addSiblingGroup span.validationMsg").hide();
    }
  });

  $("#addChildHir").live("click", function () {
    if (validation("addChildGroup") == true) {
      var params = {
        unid: $("#addChild input#unid").val(),
        groupName: $("#addChild input#groupName").val(),
        startDate: $("#addChild input#startDate").val(),
        parentId: $(".jstree-clicked").parent().attr("unid"),
        endDate: $("#addChild input#endDate").val(),
      };
      var data = $(".jstree-clicked").parents(".hierarchyContainer").attr("id");
      if (data == "organizationContainer") {
        url = "/groups/organization/add-child";
      } else {
        url = "/groups/product/add-child";
      }
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          var data = $(".jstree-clicked")
            .parents(".hierarchyContainer")
            .attr("id");
          if (data == "organizationContainer") {
            $.jstree
              ._reference($("#organizationHierarchy"))
              .refresh($(".jstree-clicked"));
          } else {
            $.jstree
              ._reference($("#productHierarchy"))
              .refresh($(".jstree-clicked"));
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message form the Server
          popAlert("Error while adding the child group.");
        },
      });
      $("#addChildGroup span.validationMsg").hide();
      $("#addChildGroup")[0].reset();
    }
  });

  $("#deleteNodeHierarchy").live("click", function () {
    var params = { unid: $(".jstree-clicked").parent().attr("unid") };
    var url = "";
    var data = $(".jstree-clicked").parents(".hierarchyContainer").attr("id");
    if (data === "organizationContainer") {
      url = "/groups/organization/delete";
    } else if (data === "productContainer") {
      url = "/groups/product/delete";
    }
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response[0].message);
        $(".pageOverlay").fadeOut("fast");
        $(".popupWrapper").fadeOut("fast");
        var data = $(".jstree-clicked")
          .parents(".hierarchyContainer")
          .attr("id");
        if (data == "organizationContainer") {
          $.jstree._reference($("#organizationHierarchy")).refresh(-1);
        } else {
          $.jstree._reference($("#productHierarchy")).refresh(-1);
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while deleting the group.");
      },
    });
  });

  $("#addAdjustment").live("click", function () {
    if (validation("createAdjustment")) {
      var params = {
        amount: $("#createAdjustment input.adjAmount").val(),
        custId: $("#createAdjustment input.adjCustId").val(),
        orgs: $("#createAdjustment input.adjOrgs").attr("unid"),
        prodId: $("#createAdjustment input.adjProdId").val(),
        prodGroups: $("#createAdjustment input.adjProdGroups").attr("unid"),
        pricingTypeId: $("#createAdjustment .adjPricingTypeId").val(),
        rangeType: $("#createAdjustment .adjRangeType").val(),
        highRange: $("#createAdjustment input.adjHighRange").val(),
        lowRange: $("#createAdjustment input.adjLowRange").val(),
        startDate: $("#createAdjustment input.adjStartDate").val(),
        endDate: $("#createAdjustment input.adjEndDate").val(),
        comment: $("#createAdjustment textarea.adjComment").val(),
      };
      var url = "/adjustments/add";
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getAdjustmentFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while adding the adjustment.");
        },
      });
    }
  });

  $("#addProduct").live("click", function () {
    if (validation("createProduct")) {
      var params = {
        custPartName: $("#createProduct input#custPartName").val(),
        masterPartName: $("#createProduct input#masterPartName").val(),
        orgId: $("#createProduct input#orgId").val(),
        productId: $("#createProduct input#productId").attr("unid"),
        proStartDate: $("#createProduct input#proStartDate").val(),
        proEndDate: $("#createProduct input#proEndDate").val(),
        proCommentText: $("#createProduct textarea#proCommentText").val(),
        attributeData: getAttrDatas("createProduct", "prodAttributes"),
      };
      var url = "/product/add";
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response[0].message);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
          getProductFirstPage(false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // TODO: need to show error message
          popAlert("Error while adding the product.");
        },
      });
      $(".customerNameVal").empty();
    }
  });

  $("#advAdjustmentSearchBtn").live("click", function () {
    //var url = "/adjustments/adv-search";
    var orgId = $("#adjAdvanceSearch input#custGroups").attr("unid");
    orgId = orgId.replace(":", ",");

    var prodGrpId = $("#adjAdvanceSearch input.adjProdGroups").attr("unid");
    prodGrpId = prodGrpId.replace(":", ",");
    var startIndex = parseInt(
      $(".adjustmentPaginationData span.startIndex").text()
    );
    var endIndex = parseInt(
      $(".adjustmentPaginationData span.endIndex").text()
    );
    var totalRecords = endIndex - startIndex + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      totalRecords: totalRecords,
      custId: $("#adjAdvanceSearch input#adjSerCustId").val(),
      orgId: orgId,
      orgGrpTyp: $("input[name=adjSerOrgGrpTyp]:radio:checked").val(),
      prodId: $("#adjAdvanceSearch input#adjSerProdId").val(),
      prodGrpId: prodGrpId,
      productGrpTyp: $("input[name=adjSerProductGrpTyp]:radio:checked").val(),
      genUnid: $("#adjAdvanceSearch input#adjSerGenUnid").val(),
      genTo: $("#adjAdvanceSearch input#adjSerGenTo").val(),
      genFrom: $("#adjAdvanceSearch input#adjSerGenFrom").val(),
      genIdMatch: $("#adjustFilterGenIdMatch").is(":checked")
        ? "true"
        : "false",
      genEffDateMatch: $("#adjustFilterGenEffDateMatch").is(":checked")
        ? "true"
        : "false",
      prcType: $("#adjSerPrcType").find(":selected").val(),
      priceIdMatch: $("#rangeTypMatch").is(":checked") ? "true" : "false",
      prcAmt: $("#adjAdvanceSearch input#adjSerPrcAmt").val(),
      priceAmntMatch: $("#priceAmntMatch").is(":checked") ? "true" : "false",
      prcRang: $("#adjSerPrcRang").find(":selected").val(),
      rangeTypMatch: $("#rangeTypMatch").is(":checked") ? "true" : "false",
      prcTo: $("#adjAdvanceSearch input#adjSerPrcTo").val(),
      prcFrom: $("#adjAdvanceSearch input#adjSerPrcFrom").val(),
      priceDateMatch: $("#priceDateMatch").is(":checked") ? "true" : "false",
      matchAllFields: $("#adjustmentNewFilterAllMatchCheck").is(":checked")
        ? "true"
        : "false",
    };

    loadAdjustmentAdvanceSearch(params);
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
    $("#adjAdvanceSearch div #advSearchPrcOperation").empty();
    $("#adjAdvanceSearch div #advSearchCustName").empty();
    $("#adjSerOrgIdTxt").attr("unid", "");
    $("#adjSerProdGrpIdTxt").attr("unid", "");
    $("#adjAdvanceSearch")[0].reset();
  });

  function loadAdjustmentAdvanceSearch(params) {
    $("#adjSearch input").val("Enter Object Name to Search");
    $("#adjSearch .inputText").attr("search", "off");
    adjustmentAdvSearchParams = params;
    jQuery.ajax({
      type: "POST",
      url: "/adjustments/adv-search",
      data: params,
      dataType: "json",
      success: function (str) {
        //check TODO : when adv-search is fixed
        $("span.noAdjRecord").hide();
        if (str.adjustments.totalRecords == 0) {
          $("span.noAdjRecord").show();
        }
        $("#adjustmentNewFilter").attr("search", "on");
        $(".adjustmentTableFiltersDisplayList").empty();
        $(".adjustmentTableFiltersDisplayList")
          .siblings()
          .children(".italicText")
          .text("filtered by");
        var filterMarkup =
          '<li><a href="#" class="removeFilterLink"><img src="resources/images/removeFilter.png"></a><span>' +
          str.adjustments.filterName +
          "</span></li>";
        $(".adjustmentTableFiltersDisplayList").append(filterMarkup);
        $("#totalAdjustments").html(
          "Adjustments - showing " +
            str.adjustments.listSize +
            " of " +
            str.adjustments.totalRecords
        );
        var totalPages =
          str.adjustments.totalRecords / adjustmentRecordsPerPage;
        $("#adjustmentRecordTable span.totalPage").text(Math.ceil(totalPages));
        hidePagination("adjustmentsTablePagination");
        loadAllAdjustment(str.adjustments.adjustments);
        $(".adjustmentPaginationData span.startIndex").text(params.startIndex);
        $(".adjustmentPaginationData span.endIndex").text(params.endIndex);
        var url = "/adjustments/recent-filters";
        var divFor = "adjustment";
        getFilters(url, divFor);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
      },
    });
  }
  //For customer name of adjustment advance search
  $("#adjSerCustId").live("blur", function () {
    $("#advSearchCustName").html("");
    if (jQuery.isEmptyObject($("#adjAdvanceSearch input#adjSerCustId").val())) {
      return;
    }
    var url = "/customers/adv-search";
    var params = {
      custId: $("#adjAdvanceSearch input#adjSerCustId").val(),
      custUnidMatch: "true",
    };
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        var customers = str.customersAdvRes.customerList;
        $("#advSearchCustName").html("");
        $.each(customers, function () {
          var name = typeof this["name"] != "undefined" ? this["name"] : "";
          $("#advSearchCustName").html(name);
          return false;
        });
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
      },
    });
  });

  //To Display org/customer name in product advance search
  $("#proSrcCustId").live("blur", function () {
    $("#advSearchCustName").html("");
    if (
      jQuery.isEmptyObject($("#prodAdvanceSearch input#proSrcCustId").val())
    ) {
      return;
    }
    var url = "/groups/organization/get-org-customer-name";
    var params = {
      unid: $("#prodAdvanceSearch input#proSrcCustId").val(),
      custUnidMatch: "true",
    };
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        $("#proSrcCustName").html("");
        $("#proSrcCustName").html(str.name);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
      },
    });
  });
  //For operation name of adjustment advance search
  $("#adjSerPrcType").live("change", function () {
    index = $("#adjSerPrcType").find(":selected").index();
    if (index != 0) {
      $("#pricingTypeOperationDropDown").prop("selectedIndex", index);
      $("#advSearchPrcOperation").html(
        $("#pricingTypeOperationDropDown").find(":selected").text()
      );
    } else {
      $("#advSearchPrcOperation").html("");
    }
  });

  //Customer Advance Search
  $("#advCustomerSearchBtn").live("click", function () {
    var custId = $("#custAdvanceSearch input#custGroups").attr("unid");
    custId = custId.replace(":", ",");
    var startIndex = parseInt(
      $(".customerPaginationData span.startIndex").text()
    );
    var endIndex = parseInt($(".customerPaginationData span.endIndex").text());
    var totalRecords = endIndex - startIndex + 1;
    var params = {
      custName: $("#custAdvanceSearch input#custAdvSrcName").val(),
      custNameMatch: $("#customerNameMatch").is(":checked") ? "true" : "false",
      custGrpId: custId,
      custGrpTyp: $("input[name=custAdvSrcGrpTyp]:radio:checked").val(),
      custId: $("#custAdvanceSearch input#custAdvSrcUnid").val(),
      custUnidMatch: $("#custAdvSrcGenIdMatch").is(":checked")
        ? "true"
        : "false",
      custToDate: $("#custAdvanceSearch input#custAdvSrcToDate").val(),
      custFromDate: $("#custAdvanceSearch input#custAdvSrcFromDate").val(),
      custAllMatchCheck: $("#customerNewFilterAllMatchCheck").is(":checked")
        ? "true"
        : "false",
      custEffDateMatch: $("#custAdvSrcEffDateMatch").is(":checked")
        ? "true"
        : "false",
      sortCol: "unid",
      sortDir: "asc",
      startIndex: startIndex,
      endIndex: endIndex,
      totalRecords: totalRecords,
    };
    loadCustomerAdvanceSearchData(params);
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
    $("#custAdvSrcGrpName").attr("unid", "");
    $("#custAdvanceSearch")[0].reset();
    $("#custAdvanceSearch input#custAdvSrcGrpId").attr("value", "");
  });

  function loadCustomerAdvanceSearchData(params) {
    $("#custSearch .inputText").attr("search", "off");
    $("#custSearch input").val("Enter Name to search");
    customerAdvSearchParams = params;
    jQuery.ajax({
      type: "POST",
      url: "/customers/adv-search",
      data: params,
      dataType: "json",
      success: function (str) {
        //check TODO : when adv-search is fixed
        $("#customerNewFilter").attr("search", "on");
        $("span.noCustRecord").hide();
        if (str.customersAdvRes.totalRecords == 0) {
          $("span.noCustRecord").show();
        }
        $(".customerTableFiltersDisplayList").empty();
        $(".customerTableFiltersDisplayList")
          .siblings()
          .children(".italicText")
          .text("filtered by");
        var filterMarkup =
          '<li><a href="#" class="removeFilterLink"><img src="resources/images/removeFilter.png"></a><span>' +
          str.customersAdvRes.filterName +
          "</span></li>";
        $(".customerTableFiltersDisplayList").append(filterMarkup);
        $("#totalCustomers").html(
          "Customers - showing " +
            str.customersAdvRes.customerList.length +
            " of " +
            str.customersAdvRes.totalRecords
        );
        var totalPages =
          str.customersAdvRes.totalRecords / customerRecordsPerPage;
        $("#customerRecordTable span.totalPage").text(Math.ceil(totalPages));
        hidePagination("customerTablePagination");
        loadAllCustomerData(str.customersAdvRes.customerList);
        $(".customerPaginationData span.startIndex").text(params.startIndex);
        $(".customerPaginationData span.endIndex").text(params.endIndex);
        var url = "/customers/recent-filters";
        var divFor = "customer";
        getFilters(url, divFor);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
      },
    });
  }
  //Product Advance Search

  $("#advProductSearchBtn").live("click", function () {
    //var url="/product/adv-search";
    var prdGrpId = $("#prodAdvanceSearch input.adjProdGroups").attr("unid");
    prdGrpId = prdGrpId.replace(":", ",");
    var startIndex = parseInt(
      $(".productPaginationData span.startIndex").text()
    );
    var endIndex = parseInt($(".productPaginationData span.endIndex").text());
    var totalRecords = endIndex - startIndex + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      totalRecords: totalRecords,
      custId: $("#prodAdvanceSearch input#proSrcCustId").val(),
      custIdGrpType: $("input[name=proSrcOrgCustName]:radio:checked").val(),
      productGrp: prdGrpId,
      productGrpTyp: $("input[name=proSrcProductGrpTyp]:radio:checked").val(),
      unid: $("#prodAdvanceSearch input#proSrcUnid").val(),
      uniqIdMatch: $("#productUniqIdMatch").is(":checked") ? "true" : "false",
      custPartName: $("#prodAdvanceSearch input#proSrcCustPartName").val(),
      customerPartNameMatch: $("#proSrcCustomerPartNameMatch").is(":checked")
        ? "true"
        : "false",
      mastName: $("#prodAdvanceSearch input#proSrcMastName").val(),
      masterPartNameMatch: $("#proSrcMasterPartNameMatch").is(":checked")
        ? "true"
        : "false",
      effDateFrom: $("#prodAdvanceSearch input#proSrcEffDateFrom").val(),
      effDateTo: $("#prodAdvanceSearch input#proSrcEffDateTo").val(),
      effDateMatch: $("#productFilterEffDateMatch").is(":checked")
        ? "true"
        : "false",
      allMatchCheck: $("#productNewFilterAllMatchCheck").is(":checked")
        ? "true"
        : "false",
    };
    loadProductAdvanceSearchData(params);
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
    $("#prodAdvanceSearch div#proSrcCustName").empty();
    $("#prodAdvanceSearch textarea#proSrcProductGrpTxt").attr("unid", "");
    $("#prodAdvanceSearch textarea#proSrcProductGrpTxt").val("");
    $("#prodAdvanceSearch")[0].reset();
  });

  function loadProductAdvanceSearchData(params) {
    $("#prodSearch .inputText").attr("search", "off");
    $("#prodSearch input").val(
      "Enter CustomerPartName/MasterPartName to Search"
    );
    productAdvSearchParams = params;
    jQuery.ajax({
      type: "POST",
      url: "/product/adv-search",
      data: params,
      dataType: "json",
      success: function (str) {
        //check TODO : when adv-search is fixed
        $("span.noProdRecord").hide();
        if (str.productAdvRes.totalRecords == 0) {
          $("span.noProdRecord").show();
        }
        $("#newProductFilter").attr("search", "on");
        $(".productsTableFiltersDisplayList").empty();
        $(".productsTableFiltersDisplayList")
          .siblings()
          .children(".italicText")
          .text("filtered by");
        var filterMarkup =
          '<li><a href="#" class="removeFilterLink"><img src="resources/images/removeFilter.png"></a><span>' +
          str.productAdvRes.filterName +
          "</span></li>";
        $(".productsTableFiltersDisplayList").append(filterMarkup);
        $("#totalProducts").html(
          "Products - showing " +
            str.productAdvRes.listSize +
            " of " +
            str.productAdvRes.totalRecords
        );
        var totalPages = str.productAdvRes.totalRecords / productRecordsPerPage;
        $("#productsRecordTable span.totalPage").text(Math.ceil(totalPages));
        hidePagination("productsTablePagination");
        loadAllProductData(str.productAdvRes.productList);
        $(".productPaginationData span.startIndex").text(params.startIndex);
        $(".productPaginationData span.endIndex").text(params.endIndex);
        var url = "/product/recent-filters";
        var divFor = "product";
        getFilters(url, divFor);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        //TODO: need to show error message
      },
    });
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
    $("#prodAdvanceSearch div#proSrcCustName").empty();
    $("#prodAdvanceSearch textarea#proSrcProductGrpTxt").attr("unid", "");
    $("#prodAdvanceSearch textarea#proSrcProductGrpTxt").val("");
    $("#prodAdvanceSearch")[0].reset();
    $("#prodAdvanceSearch input.adjProdGroups").attr("unid", "");
    $("#prodAdvanceSearch input#proSrcCustId").val("");
    $("#prodAdvanceSearch input#proSrcCustId").attr("unid", "");
  }

  //For Pricing Operation load
  function loadPricingOperation(pricingOperationDropDownId, selTxt) {
    var url = "/pricing-type/operations";
    jQuery.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      success: function (str) {
        $.each(str.pricingOperations, function () {
          var unid = typeof this["unid"] != "undefined" ? this["unid"] : "";
          var description =
            typeof this["description"] != "undefined"
              ? this["description"]
              : "";
          var o = new Option(description, unid);
          $(pricingOperationDropDownId).append(o);
          if (unid == selTxt) {
            $(pricingOperationDropDownId).val(selTxt);
          }
        });
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading Pricing-Type operations.");
      },
    });
  }
  function loadPricingType(pricingTypeDropDownId, selTxt) {
    var url = "/pricing-type/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      success: function (str) {
        $.each(str.pricingTypes.pricingTypes, function () {
          var unid = typeof this["unid"] != "undefined" ? this["unid"] : "";
          var description =
            typeof this["description"] != "undefined"
              ? this["description"]
              : "";
          var o = new Option(description, unid);
          $(pricingTypeDropDownId).append(o);
          if (unid == selTxt) {
            $(pricingTypeDropDownId).val(selTxt);
          }
        });
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading pricing-type data");
      },
    });
  }
  //Create pricing type
  $("#createPricingTypeBtn").live("click", function () {
    if (
      validation("createPricingTypeForm") &&
      pricingOperationValidation("#pricingTypeOperationDropDown")
    ) {
      var url = "/pricing-type/add";
      var params = {
        description: $("#createPricingTypeForm input#pricingTypeDesc").val(),
        operationId: $("#pricingTypeOperationDropDown").find(":selected").val(),
        targetId: $("#targetTypeDropDown").find(":selected").val(),
        optionalArgs: $(
          "#createPricingTypeForm textarea#pricingTypeOptArgs"
        ).val(),
      };
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response.message);
          getPricingTypeFirstPage(false);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          //TODO: add error message
          popAlert("Error while adding the pricing-type.");
        },
      });
    }
    $("#createPricingTypeForm")[0].reset();
  });
  $("#editPricingTypeBtn").live("click", function () {
    if (
      validation("editPricingTypeForm") &&
      pricingOperationValidation("#pricingTypeOperationDropDownEdit")
    ) {
      var url = "/pricing-type/edit";
      var params = {
        unid: $("#pricingTypesRecordsTableEditPopup td.priTypeUnid").text(),
        description: $("#editPricingTypeForm input#pricingTypeDesc").val(),
        operationId: $("#pricingTypeOperationDropDownEdit")
          .find(":selected")
          .val(),
        targetId: $("#targetTypeDropDownEdit").find(":selected").val(),
        optionalArgs: $(
          "#editPricingTypeForm textarea#pricingTypeOptArgs"
        ).val(),
      };
      jQuery.ajax({
        type: "POST",
        url: url,
        data: params,
        dataType: "json",
        success: function (str) {
          popSuccessMessage(str.response.message);
          getPricingTypeFirstPage(false);
          $(".pageOverlay").fadeOut("fast");
          $(".popupWrapper").fadeOut("fast");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          //TODO: add error message
          popAlert("Error while updating the pricing-type.");
        },
      });
    }
  });

  $("#pricingTypesTable .sortable").live("click", function () {
    var sortDir = $(this).attr("sortDir");
    var sortCol = $(this).attr("sortCol");
    $(".pricingTypePaginationData span.sortCol").text(sortCol);
    $(".pricingTypePaginationData span.sortDir").text(sortDir);
    var params = { sortCol: sortCol, sortDir: sortDir };
    getPricingTypeFirstPage(false, params);
    var newSortDir = sortDir == "asc" ? "desc" : "asc";
    $(this).attr("sortDir", newSortDir);
  });

  $("#pricingTypesTable .first-page").live("click", function () {
    getPricingTypeFirstPage(true);
    return false;
  });

  $("#pricingTypesTable .last-page").live("click", function () {
    getPricingTypeLastPage();
    return false;
  });
  var hint = "";
  $("input.hintText").focus(function () {
    hint = $(this).val();
    $(this).val("");
  });
  $("input.hintText").blur(function () {
    if ($(this).val() == "") {
      $(this).val(hint);
      hint = "";
    }
  });

  function getPricingTypeLastPage() {
    var currentPage = $("#pricingTypesTable span.pageNum").text();
    var lastPage = $("#pricingTypesTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var sortCol = $(".pricingTypePaginationData span.sortCol").text();
    var sortDir = $(".pricingTypePaginationData span.sortDir").text();
    var lastPage = $("#pricingTypesTable span.totalPage").text();
    var endIndex = parseInt(lastPage) * totalRecordsPerPage;
    var startIndex = endIndex - totalRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadPricingTypesData(params);
    $("#pricingTypesTable span.pageNum").text(lastPage);
  }

  function getPricingTypeFirstPage(isPagination, params) {
    var sIndex = $(".pricingTypePaginationData span.startIndex").text();
    if (sIndex == 1 && isPagination) {
      return false;
    }
    if (typeof params == "undefined") {
      params = {};
    }
    var sortCol = $(".pricingTypePaginationData span.sortCol").text();
    var sortDir = $(".pricingTypePaginationData span.sortDir").text();
    var startIndex = 1;
    var endIndex = pricingTypeRecordsPerPage;
    params["startIndex"] = startIndex;
    params["endIndex"] = endIndex;
    params["sortCol"] = sortCol;
    params["sortDir"] = sortDir;
    loadPricingTypesData(params);
    $("#pricingTypesTable span.pageNum").text(startIndex);
  }

  $("#pricingTypesTable .next").live("click", function () {
    //create params
    var currentPage = $("#pricingTypesTable span.pageNum").text();
    var lastPage = $("#pricingTypesTable span.totalPage").text();
    var sortCol = $(".pricingTypePaginationData span.sortCol").text();
    var sortDir = $(".pricingTypePaginationData span.sortDir").text();
    if (currentPage == lastPage) {
      return false;
    }
    var startIndex = $(".pricingTypePaginationData span.endIndex").text();
    startIndex = parseInt(startIndex) + 1;
    var endIndex = startIndex + pricingTypeRecordsPerPage - 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadPricingTypesData(params);
    $("#pricingTypesTable span.pageNum").text(parseInt(currentPage) + 1);
    return false;
  });

  $("#pricingTypesTable .prev").live("click", function () {
    //create params
    var endIndex = $(".pricingTypePaginationData span.startIndex").text();
    var sortCol = $(".pricingTypePaginationData span.sortCol").text();
    var sortDir = $(".pricingTypePaginationData span.sortDir").text();
    if (endIndex == 1) {
      return false;
    }
    endIndex = parseInt(endIndex) - 1;
    var startIndex = endIndex - pricingTypeRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadPricingTypesData(params);
    var currentPage = $("#pricingTypesTable span.pageNum").text();
    $("#pricingTypesTable span.pageNum").text(parseInt(currentPage) - 1);
    return false;
  });

  $("#pricingSeqTable .sortable").live("click", function () {
    var sortDir = $(this).attr("sortDir");
    var sortCol = $(this).attr("sortCol");
    $(".pricingSeqPaginationData span.sortCol").text(sortCol);
    $(".pricingSeqPaginationData span.sortDir").text(sortDir);
    var params = { sortCol: sortCol, sortDir: sortDir };
    getPricingSeqFirstPage(false, params);
    var newSortDir = sortDir == "asc" ? "desc" : "asc";
    $(this).attr("sortDir", newSortDir);
  });

  $("#pricingSeqTable .first-page").live("click", function () {
    getPricingSeqFirstPage(true);
    return false;
  });

  $("#pricingSeqTable .last-page").live("click", function () {
    getPricingSeqLastPage();
    return false;
  });

  function getPricingSeqLastPage() {
    var currentPage = $("#pricingSeqTable span.pageNum").text();
    var lastPage = $("#pricingSeqTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var sortCol = $(".pricingSeqPaginationData span.sortCol").text();
    var sortDir = $(".pricingSeqPaginationData span.sortDir").text();
    var lastPage = $("#pricingSeqTable span.totalPage").text();
    var endIndex = parseInt(lastPage) * pricingSeqRecordsPerPage;
    var startIndex = endIndex - pricingSeqRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadPricingSequenceData(params);
    $("#pricingSeqTable span.pageNum").text(lastPage);
  }

  function getPricingSeqFirstPage(isPagination, params) {
    var sIndex = $(".pricingSeqPaginationData span.startIndex").text();
    if (sIndex == 1 && isPagination) {
      return false;
    }
    if (typeof params == "undefined") {
      params = {};
    }
    var sortCol = $(".pricingSeqPaginationData span.sortCol").text();
    var sortDir = $(".pricingSeqPaginationData span.sortDir").text();
    var startIndex = 1;
    var endIndex = pricingSeqRecordsPerPage;
    params["startIndex"] = startIndex;
    params["endIndex"] = endIndex;
    params["sortCol"] = sortCol;
    params["sortDir"] = sortDir;
    loadPricingSequenceData(params);
    $("#pricingSeqTable span.pageNum").text(startIndex);
  }

  $("#pricingSeqTable .next").live("click", function () {
    //create params
    var currentPage = $("#pricingSeqTable span.pageNum").text();
    var lastPage = $("#pricingSeqTable span.totalPage").text();
    var sortCol = $(".pricingSeqPaginationData span.sortCol").text();
    var sortDir = $(".pricingSeqPaginationData span.sortDir").text();
    if (currentPage == lastPage) {
      return false;
    }
    var startIndex = $(".pricingSeqPaginationData span.endIndex").text();
    startIndex = parseInt(startIndex) + 1;
    var endIndex = startIndex + pricingSeqRecordsPerPage - 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadPricingSequenceData(params);
    $("#pricingSeqTable span.pageNum").text(parseInt(currentPage) + 1);
    return false;
  });

  $("#pricingSeqTable .prev").live("click", function () {
    //create params
    var endIndex = $(".pricingSeqPaginationData span.startIndex").text();
    var sortCol = $(".pricingSeqPaginationData span.sortCol").text();
    var sortDir = $(".pricingSeqPaginationData span.sortDir").text();
    if (endIndex == 1) {
      return false;
    }
    endIndex = parseInt(endIndex) - 1;
    var startIndex = endIndex - pricingSeqRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadPricingSequenceData(params);
    var currentPage = $("#pricingSeqTable span.pageNum").text();
    $("#pricingSeqTable span.pageNum").text(parseInt(currentPage) - 1);
    return false;
  });

  function loadPricingTypesData(params) {
    var url = "/pricing-type/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        $("#totalPricingTypes").html(
          "Pricing Types - showing " +
            str.pricingTypes.listSize +
            " of " +
            str.pricingTypes.totalPricingTypeRecords
        );
        var totalPages =
          str.pricingTypes.totalPricingTypeRecords / pricingTypeRecordsPerPage;
        $("#pricingTypesTable span.totalPage").text(Math.ceil(totalPages));
        loadAllPricingTypeData(str.pricingTypes.pricingTypes);
        $(".pricingTypePaginationData span.startIndex").text(params.startIndex);
        $(".pricingTypePaginationData span.endIndex").text(params.endIndex);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading Pricing Type data");
      },
    });
  }
  function loadAllPricingTypeData(pricingType) {
    $("#pricingTypeTable").html("");
    $("#pricingTypeDetails").html("");
    $.each(pricingType, function () {
      loadUIPricingTypeData(this);
      loadHiddenPricingTypeData(this);
    });
  }

  function loadUIPricingTypeData(pricingType) {
    var unid =
      typeof pricingType["unid"] != "undefined" ? pricingType["unid"] : "";
    var description =
      typeof pricingType["description"] != "undefined"
        ? pricingType["description"]
        : "";
    var operation =
      typeof pricingType["operation"] != "undefined"
        ? pricingType["operation"]
        : "";
    var target =
      typeof pricingType["targetText"] != "undefined"
        ? pricingType["targetText"]
        : "";
    var optionalArgs =
      typeof pricingType["optionalArgs"] != "undefined"
        ? pricingType["optionalArgs"]
        : "";
    var body = $("<tr>").attr("id", "pritype_" + unid);
    var unidEle = $("<td>").addClass("first-child priTypeUnid").append(unid);
    var descriptionEle = $("<td>")
      .addClass("pricing-type pricingTypeDescription")
      .append(description);
    var operationEle = $("<td>").append(operation);
    var targetEle = $("<td>").append(target);
    var optArgsEle = $("<td>").append(optionalArgs);
    var editImage = $("<img>").attr("src", "resources/images/editRow.png");
    var deleteImage = $("<img>").attr("src", "resources/images/deleteRow.png");
    var editEleContent = $("<a>")
      .attr("href", "")
      .addClass("editRowLink")
      .append(editImage);
    var deleteEleContent = $("<a>")
      .attr("href", "")
      .addClass("deleteRowLink deletePricingType")
      .append(deleteImage);
    var lastEle = $("<td>")
      .addClass("last-child")
      .append(editEleContent)
      .append(deleteEleContent);
    body
      .append(unidEle)
      .append(descriptionEle)
      .append(operationEle)
      .append(targetEle);
    body.append(optArgsEle).append(lastEle);
    $("#pricingTypeTable").append(body);
  }
  function loadHiddenPricingTypeData(pricingType) {
    var unid =
      typeof pricingType["unid"] != "undefined" ? pricingType["unid"] : "";
    var description =
      typeof pricingType["description"] != "undefined"
        ? pricingType["description"]
        : "";
    var operationId =
      typeof pricingType["operation"] != "undefined"
        ? pricingType["operation"]
        : "";
    var target =
      typeof pricingType["targetText"] != "undefined"
        ? pricingType["targetText"]
        : "";
    var optionalArgs =
      typeof pricingType["optionalArgs"] != "undefined"
        ? pricingType["optionalArgs"]
        : "";
    var body = $("<div>").attr("id", "val_pritype_" + unid);

    var unidEle = $("<span>").addClass("priTypeUnid").append(unid);

    var descriptionEle = $("<span>")
      .addClass("priTypeDescription")
      .append(description);
    var operationEle = $("<span>")
      .addClass("priTypeOperationId")
      .append(operationId);
    var targetEle = $("<span>").addClass("priTypeTarget").append(target);
    var optArgsEle = $("<span>")
      .addClass("priTypeOptionalArgs")
      .append(optionalArgs);
    body
      .append(unid)
      .append(unidEle)
      .append(descriptionEle)
      .append(operationEle)
      .append(targetEle)
      .append(optArgsEle);
    $("#pricingTypeDetails").append(body);
  }

  //Load Pricing sequence
  function loadPricingSequenceData(params) {
    var url = "/pricing-sequence/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        $("#totalPricingSequences").html(
          "Pricing Sequences - showing " +
            str.pricingSequences.listSize +
            " of " +
            str.pricingSequences.totalPricingSeqRecords
        );
        var totalPages =
          str.pricingSequences.totalPricingSeqRecords /
          pricingSeqRecordsPerPage;
        $("#pricingSeqTable span.totalPage").text(Math.ceil(totalPages));
        loadAllPricingSequenceData(str.pricingSequences.sequences);
        $(".pricingSeqPaginationData span.startIndex").text(params.startIndex);
        $(".pricingSeqPaginationData span.endIndex").text(params.endIndex);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading Pricing Sequence data");
      },
    });
  }
  function loadAllPricingSequenceData(pricingSequence) {
    $("#pricingSequenceTable").html("");
    $.each(pricingSequence, function () {
      loadUIPricingSequenceData(this);
    });
  }
  function loadUIPricingSequenceData(pricingType) {
    var unid =
      typeof pricingType["unid"] != "undefined" ? pricingType["unid"] : "";
    var description =
      typeof pricingType["description"] != "undefined"
        ? pricingType["description"]
        : "";
    var body = $("<tr>")
      .attr("id", "pritype_" + unid)
      .addClass("expandableRow");
    var unidEle = $("<td>").addClass("first-child");
    var expandImg = $("<img>").attr("src", "resources/images/expand-row.png");
    var expandRowLinkEle = $("<a>")
      .attr("href", "")
      .addClass("expandRowLink")
      .append(expandImg);
    var collapseImg = $("<img>").attr(
      "src",
      "resources/images/collapse-row.png"
    );
    var collapseRowLinkEle = $("<a>")
      .attr("href", "")
      .addClass("collapseRowLink hidden")
      .append(collapseImg);
    var unidSpan = $("<span>").attr("id", "sequenceUnid").append(unid);

    var descriptionEle = $("<td>")
      .addClass("pricing-seq-desc")
      .append(description);

    var lastChild = $("<td>").addClass("last-child");

    var saveLinkImg = $("<img>").attr("src", "resources/images/saveLink.png");
    var savePriLink = $("<a>")
      .attr("href", "#")
      .addClass("savePricingLink hidden");
    savePriLink.attr("id", "editPricingSequence");
    savePriLink.append(saveLinkImg);

    var deleteEditImg = $("<img>").attr(
      "src",
      "/resources/images/delete-edit-row.png"
    );
    var closeEditLink = $("<a>")
      .attr("href", "")
      .addClass("closeEditRowLink hidden")
      .append(deleteEditImg);

    var editImgRow = $("<img>").attr("src", "/resources/images/editRow.png");
    var editPricingSeqPricingTypeRow = $("<a>")
      .attr("href", "")
      .addClass("editPricingSeqPricingTypeRow")
      .append(editImgRow);

    var deleteImgRow = $("<img>").attr(
      "src",
      "/resources/images/deleteRow.png"
    );
    var deleteRowLink = $("<a>")
      .attr("href", "")
      .addClass("deleteRowLink deletePricingSequence")
      .append(deleteImgRow);
    body.append(unidEle);
    unidEle
      .append(expandRowLinkEle)
      .append(collapseRowLinkEle)
      .append(collapseRowLinkEle)
      .append(unidSpan);

    body.append(descriptionEle);
    body.append(lastChild);
    lastChild
      .append(savePriLink)
      .append(closeEditLink)
      .append(editPricingSeqPricingTypeRow)
      .append(deleteRowLink);

    $("#pricingSequenceTable").append(body);
  }
  //Done
  function loadPricingTypeSeq(seqId, recordTblBody) {
    var url = "/pricing-sequence/pricing-list-seqid";
    params = {
      seqId: seqId,
    };
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        // display UI data and hidden data
        $.each(str.pricingTypes, function () {
          var dataRow = $("<tr>");
          dataRow.attr(
            "id",
            "pricingTypeId_" + this["operationId"] + "_" + seqId
          );
          dataRow.addClass("pricingSeqOperation");
          dataRow.attr("seqId", "pricingSeqId_" + seqId);
          dataRow.attr("newRow", "false");
          // dataRow.addClass("pricingTypeId_"+this['operationId']);
          dataRow.attr("seqId", "pricingSeqId_" + seqId);
          var dataPricingType = $("<td>")
            .addClass("pricingTypeCol")
            .append(this["description"]);
          var dataTarget = $("<td>").append(
            this["targetText"] +
              " <a href='#' class='fright deletePricingTypeRow'><img src='../../resources/images/delete-node.png' alt='delete row' class='deleteSeqEditRow'/></a>"
          );
          dataRow.append(dataPricingType);
          var hidId = $("<input>")
            .addClass("pricingTypeIdHid_" + seqId)
            .attr("type", "hidden")
            .attr("value", this["operationId"]);
          dataRow.append(hidId);
          dataRow.append(dataTarget);
          recordTblBody.append(dataRow);
        });
        var dragRowHtml =
          "<tr class='placeholder'><td class='dragDropTitle' colspan='6'>Drag and drop pricing types from the pricing table above.</td></tr>";
        recordTblBody.append(dragRowHtml);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading Pricing Type sequence data");
      },
    });
    return true;
  }

  function pricingTypeSeqDelete(seqId) {
    var url = "/pricing-sequence/pricing-list-seqid";
    params = {
      seqId: seqId,
    };
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        popAlert(str);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading Pricing Type sequence data");
      },
    });
  }

  $("#groupCombinationsTable .sortable").live("click", function () {
    var sortDir = $(this).attr("sortDir");
    var sortCol = $(this).attr("sortCol");
    $(".groupComboPaginationData span.sortCol").text(sortCol);
    $(".groupComboPaginationData span.sortDir").text(sortDir);
    var params = { sortCol: sortCol, sortDir: sortDir };
    getGroupComboFirstPage(false, params);
    var newSortDir = sortDir == "asc" ? "desc" : "asc";
    $(this).attr("sortDir", newSortDir);
  });

  $("#groupCombinationsTable .first-page").live("click", function () {
    getGroupComboFirstPage(true);
    return false;
  });

  $("#groupCombinationsTable .last-page").live("click", function () {
    getGroupComboLastPage();
    return false;
  });

  function getGroupComboLastPage() {
    var currentPage = $("#groupCombinationsTable span.pageNum").text();
    var lastPage = $("#groupCombinationsTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var sortCol = $(".groupComboPaginationData span.sortCol").text();
    var sortDir = $(".groupComboPaginationData span.sortDir").text();
    var lastPage = $("#groupCombinationsTable span.totalPage").text();
    var endIndex = parseInt(lastPage) * groupComboRecordsPerPage;
    var startIndex = endIndex - groupComboRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadGroupComboData(params);
    $("#groupCombinationsTable span.pageNum").text(lastPage);
  }

  function getGroupComboFirstPage(isPagination, params) {
    var sIndex = $(".groupComboPaginationData span.startIndex").text();
    if (sIndex == 1 && isPagination) {
      return false;
    }
    if (typeof params == "undefined") {
      params = {};
    }
    var sortCol = $(".groupComboPaginationData span.sortCol").text();
    var sortDir = $(".groupComboPaginationData span.sortDir").text();
    var startIndex = 1;
    var endIndex = groupComboRecordsPerPage;
    params["startIndex"] = startIndex;
    params["endIndex"] = endIndex;
    params["sortCol"] = sortCol;
    params["sortDir"] = sortDir;
    loadGroupComboData(params);
    $("#groupCombinationsTable span.pageNum").text(startIndex);
  }

  $("#groupCombinationsTable .next").live("click", function () {
    //create params
    var currentPage = $("#groupCombinationsTable span.pageNum").text();
    var lastPage = $("#groupCombinationsTable span.totalPage").text();
    var sortCol = $(".groupComboPaginationData span.sortCol").text();
    var sortDir = $(".groupComboPaginationData span.sortDir").text();
    if (currentPage == lastPage) {
      return false;
    }
    var startIndex = $(".groupComboPaginationData span.endIndex").text();
    startIndex = parseInt(startIndex) + 1;
    var endIndex = startIndex + groupComboRecordsPerPage - 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadGroupComboData(params);
    $("#groupCombinationsTable span.pageNum").text(parseInt(currentPage) + 1);
    return false;
  });

  $("#groupCombinationsTable .prev").live("click", function () {
    //create params
    var endIndex = $(".groupComboPaginationData span.startIndex").text();
    var sortCol = $(".groupComboPaginationData span.sortCol").text();
    var sortDir = $(".groupComboPaginationData span.sortDir").text();
    if (endIndex == 1) {
      return false;
    }
    endIndex = parseInt(endIndex) - 1;
    var startIndex = endIndex - groupComboRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadGroupComboData(params);
    var currentPage = $("#groupCombinationsTable span.pageNum").text();
    $("#groupCombinationsTable span.pageNum").text(parseInt(currentPage) - 1);
    return false;
  });

  //Load Group Combo Data
  function loadGroupComboData(params) {
    var url = "/group-combo/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        loadAllGroupComboData(str.groupCombos.groupCombos);
        $("#totalGroupCombinations").html(
          "Group Combinations - showing " +
            str.groupCombos.groupCombos.length +
            " of " +
            str.groupCombos.totalRecords
        );
        var totalPages =
          str.groupCombos.totalRecords / groupComboRecordsPerPage;
        $("#groupCombinationsTable span.totalPage").text(Math.ceil(totalPages));
        $(".groupComboPaginationData span.startIndex").text(params.startIndex);
        $(".groupComboPaginationData span.endIndex").text(params.endIndex);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading group combo data.");
      },
    });
  }

  function loadAllGroupComboData(groupCombos) {
    $("#groupComboTable").html("");
    $.each(groupCombos, function () {
      loadUIGroupComboData(this);
    });
  }
  function loadUIGroupComboData(groupCombo) {
    var unid =
      typeof groupCombo["unid"] != "undefined" ? groupCombo["unid"] : "";
    var description =
      typeof groupCombo["description"] != "undefined"
        ? groupCombo["description"]
        : "";
    var type =
      typeof groupCombo["type"] != "undefined" ? groupCombo["type"] : "";
    var sequence =
      typeof groupCombo["sequence"] != "undefined"
        ? groupCombo["sequence"]
        : "";
    var comboGroupIds =
      typeof groupCombo["comboGroupIds"] != "undefined"
        ? groupCombo["comboGroupIds"]
        : "";
    var comment =
      typeof groupCombo["commentText"] != "undefined"
        ? groupCombo["commentText"]
        : "";
    var body = $("<tr>").attr("id", "grpCombo_" + unid);
    var unidEle = $("<td>").addClass("first-child groupComboUnid").append(unid);
    var descriptionEle = $("<td>")
      .addClass("groupComboDescription")
      .append(description);
    var typeEle = $("<td>").addClass("groupComboType").append(type);
    var sequenceEle = $("<td>").addClass("groupComboSequence").append(sequence);
    var commentEle = $("<td>")
      .attr("style", "display: none")
      .addClass("groupComboCommentText")
      .append(comment);
    var comboGroupIdsEle = $("<td>")
      .addClass("groupComboIds")
      .append(comboGroupIds);
    var editImage = $("<img>").attr("src", "resources/images/editRow.png");
    var deleteImage = $("<img>").attr("src", "resources/images/deleteRow.png");
    var editEleContent = $("<a>")
      .attr("href", "")
      .addClass("editRowLink editGroupCombo")
      .append(editImage);
    var deleteEleContent = $("<a>")
      .attr("href", "")
      .addClass("deleteRowLink deleteGroupCombo")
      .append(deleteImage);
    var lastEle = $("<td>")
      .addClass("last-child")
      .append(editEleContent)
      .append(deleteEleContent);
    body.append(unidEle);
    body.append(descriptionEle);
    body.append(typeEle);
    body.append(sequenceEle);
    body.append(commentEle);
    body.append(comboGroupIdsEle);
    body.append(lastEle);

    $("#groupComboTable").append(body);
  }

  $("#ProductAttributesTable .sortable").live("click", function () {
    var sortDir = $(this).attr("sortDir");
    var sortCol = $(this).attr("sortCol");
    $(".productAttrPaginationData span.sortCol").text(sortCol);
    $(".productAttrPaginationData span.sortDir").text(sortDir);
    var params = { sortCol: sortCol, sortDir: sortDir };
    getProductAttributeFirstPage(false, params);
    var newSortDir = sortDir == "asc" ? "desc" : "asc";
    $(this).attr("sortDir", newSortDir);
  });

  $("#ProductAttributesTable .first-page").live("click", function () {
    getProductAttributeFirstPage(true);
    return false;
  });

  $("#ProductAttributesTable .last-page").live("click", function () {
    getProductAttributeLastPage();
    return false;
  });

  function getProductAttributeLastPage() {
    var currentPage = $("#ProductAttributesTable span.pageNum").text();
    var lastPage = $("#ProductAttributesTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var sortCol = $(".productAttrPaginationData span.sortCol").text();
    var sortDir = $(".productAttrPaginationData span.sortDir").text();
    var lastPage = $("#ProductAttributesTable span.totalPage").text();
    var endIndex = parseInt(lastPage) * prodAttrRecordsPerPage;
    var startIndex = endIndex - prodAttrRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadProductAttributeData(params);
    $("#ProductAttributesTable span.pageNum").text(lastPage);
  }

  function getProductAttributeFirstPage(isPagination, params) {
    var sIndex = $(".productAttrPaginationData span.startIndex").text();
    if (sIndex == 1 && isPagination) {
      return false;
    }
    if (typeof params == "undefined") {
      params = {};
    }
    var sortCol = $(".productAttrPaginationData span.sortCol").text();
    var sortDir = $(".productAttrPaginationData span.sortDir").text();
    var startIndex = 1;
    var endIndex = prodAttrRecordsPerPage;
    params["startIndex"] = startIndex;
    params["endIndex"] = endIndex;
    params["sortCol"] = sortCol;
    params["sortDir"] = sortDir;
    loadProductAttributeData(params);
    $("#ProductAttributesTable span.pageNum").text(startIndex);
  }

  $("#ProductAttributesTable .next").live("click", function () {
    //create params
    var currentPage = $("#ProductAttributesTable span.pageNum").text();
    var lastPage = $("#ProductAttributesTable span.totalPage").text();
    var sortCol = $(".productAttrPaginationData span.sortCol").text();
    var sortDir = $(".productAttrPaginationData span.sortDir").text();
    if (currentPage == lastPage) {
      return false;
    }
    var startIndex = $(".productAttrPaginationData span.endIndex").text();
    startIndex = parseInt(startIndex) + 1;
    var endIndex = startIndex + prodAttrRecordsPerPage - 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadProductAttributeData(params);
    $("#ProductAttributesTable span.pageNum").text(parseInt(currentPage) + 1);
    return false;
  });

  $("#ProductAttributesTable .prev").live("click", function () {
    //create params
    var endIndex = $(".productAttrPaginationData span.startIndex").text();
    var sortCol = $(".productAttrPaginationData span.sortCol").text();
    var sortDir = $(".productAttrPaginationData span.sortDir").text();
    if (endIndex == 1) {
      return false;
    }
    endIndex = parseInt(endIndex) - 1;
    var startIndex = endIndex - prodAttrRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadProductAttributeData(params);
    var currentPage = $("#ProductAttributesTable span.pageNum").text();
    $("#ProductAttributesTable span.pageNum").text(parseInt(currentPage) - 1);
    return false;
  });

  $("#CustomersAttributesTable .sortable").live("click", function () {
    var sortDir = $(this).attr("sortDir");
    var sortCol = $(this).attr("sortCol");
    $(".customerAttrPaginationData span.sortCol").text(sortCol);
    $(".customerAttrPaginationData span.sortDir").text(sortDir);
    var params = { sortCol: sortCol, sortDir: sortDir };
    getCustomerAttributeFirstPage(false, params);
    var newSortDir = sortDir == "asc" ? "desc" : "asc";
    $(this).attr("sortDir", newSortDir);
  });

  $("#CustomersAttributesTable .first-page").live("click", function () {
    getCustomerAttributeFirstPage(true);
    return false;
  });

  $("#CustomersAttributesTable .last-page").live("click", function () {
    getCustomerAttributeLastPage();
    return false;
  });

  function getCustomerAttributeLastPage() {
    var currentPage = $("#ProductAttributesTable span.pageNum").text();
    var lastPage = $("#ProductAttributesTable span.totalPage").text();
    if (currentPage == lastPage) {
      return false;
    }
    var sortCol = $(".customerAttrPaginationData span.sortCol").text();
    var sortDir = $(".customerAttrPaginationData span.sortDir").text();
    var lastPage = $("#CustomersAttributesTable span.totalPage").text();
    var endIndex = parseInt(lastPage) * custAttrRecordsPerPage;
    var startIndex = endIndex - custAttrRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadCustomerAttributesData(params);
    $("#CustomersAttributesTable span.pageNum").text(lastPage);
  }

  function getCustomerAttributeFirstPage(isPagination, params) {
    var sIndex = $(".customerAttrPaginationData span.startIndex").text();
    if (sIndex == 1 && isPagination) {
      return false;
    }
    if (typeof params == "undefined") {
      params = {};
    }
    var sortCol = $(".customerAttrPaginationData span.sortCol").text();
    var sortDir = $(".customerAttrPaginationData span.sortDir").text();
    var startIndex = 1;
    var endIndex = custAttrRecordsPerPage;
    params["startIndex"] = startIndex;
    params["endIndex"] = endIndex;
    params["sortCol"] = sortCol;
    params["sortDir"] = sortDir;
    loadCustomerAttributesData(params);
    $("#CustomersAttributesTable span.pageNum").text(startIndex);
  }

  $("#CustomersAttributesTable .next").live("click", function () {
    //create params
    var currentPage = $("#CustomersAttributesTable span.pageNum").text();
    var lastPage = $("#CustomersAttributesTable span.totalPage").text();
    var sortCol = $(".customerAttrPaginationData span.sortCol").text();
    var sortDir = $(".customerAttrPaginationData span.sortDir").text();
    if (currentPage == lastPage) {
      return false;
    }
    var startIndex = $(".customerAttrPaginationData span.endIndex").text();
    startIndex = parseInt(startIndex) + 1;
    var endIndex = startIndex + custAttrRecordsPerPage - 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadCustomerAttributesData(params);
    $("#CustomersAttributesTable span.pageNum").text(parseInt(currentPage) + 1);
    return false;
  });

  $("#CustomersAttributesTable .prev").live("click", function () {
    //create params
    var endIndex = $(".customerAttrPaginationData span.startIndex").text();
    var sortCol = $(".customerAttrPaginationData span.sortCol").text();
    var sortDir = $(".customerAttrPaginationData span.sortDir").text();
    if (endIndex == 1) {
      return false;
    }
    endIndex = parseInt(endIndex) - 1;
    var startIndex = endIndex - custAttrRecordsPerPage + 1;
    var params = {
      startIndex: startIndex,
      endIndex: endIndex,
      sortCol: sortCol,
      sortDir: sortDir,
    };
    loadCustomerAttributesData(params);
    var currentPage = $("#CustomersAttributesTable span.pageNum").text();
    $("#CustomersAttributesTable span.pageNum").text(parseInt(currentPage) - 1);
    return false;
  });

  /*--- create Group combinations,Create Product Attribute,Create Customers Attribute popups Call ---*/
  $(".createNewGroupCominations").live("click", function () {
    $("#createGroupComboForm div.groupComboTypeDivWrapper").removeClass(
      "jstree-drop-org"
    ); // This is needed to remove the class if exists.
    $("#createGroupComboForm div.groupComboTypeDivWrapper").removeClass(
      "jstree-drop-product"
    );
    $("#createGroupComboForm div.groupComboTypeDivWrapper").attr("unid", "");
    $(".validationMsg").hide();
    $("#groupComboTypeTable tbody").empty();
    $("#createGroupComboForm")[0].reset();
    $("#createGroupComboForm div.groupComboTypeDivWrapper").addClass(
      "jstree-drop-org"
    ); //To add the class after removing.(To avoid the multiple classes of same name)
    $("#createGroupComboForm input#groupOrganization").attr(
      "checked",
      "checked"
    );
    $("#createGroupComboForm input#groupPriority").val(1);
    var recordTypeId = $(this).attr("id");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    // $('.pageOverlay').fadeIn('fast');
    $("#" + recordTypeId + "Popup").fadeIn("fast");
    return false;
  });
  $(".createProductAttribute").live("click", function () {
    $(".validationMsg").hide();
    $("#createProductAttributeForm")[0].reset();
    var recordTypeId = $(this).attr("id");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#" + recordTypeId + "Popup").fadeIn("fast");
    return false;
  });
  $(".createCustomerAttribute").live("click", function () {
    $(".validationMsg").hide();
    $("#customerAttributeForm")[0].reset();
    var recordTypeId = $(this).attr("id");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#" + recordTypeId + "Popup").fadeIn("fast");
    return false;
  });

  // /*------ Resizeable ------ */
  //  $('.master-data-table-container .recordTableWrapper').resizable({
  //      aspectRatio: true
  //  });

  /*---- Testing scripts ----- */
  $("#addlineItemLink").live("click", function () {
    var productIDNext = 1;
    var element = $(".lineItemTbody tr.lineItemRow");
    productIDLast = element.last().children("td.first-child").text();
    if (productIDLast) {
      productIDNext = parseInt(productIDLast) + 1;
    }
    var newLineItem =
      "<tr class='lineItemRow'><td class='first-child'>" +
      productIDNext +
      "</td><td><input type='text' class='inputText rangeInput'>" +
      "</td><td><input type='text' class='inputText rangeInput'/></td><td></td><td></td><td></td><td></td><td></td><td></td>" +
      "<td class='last-child'><input type='text' class='inputText rangeInput'></td></tr>";
    $("#lineItemTable tbody.lineItemTbody").append(newLineItem);
    return false;
  });

  $("#lineItemTable .expandRowLink").live("click", function () {
    $(this).addClass("hidden");
    $(this).siblings(".collapseRowLink").removeClass("hidden");
    $(this)
      .parents("tr.expandableRow")
      .next("tr.lineItemExpandedRow")
      .attr("style", "");
    $(this).parents(".expandableRow").addClass("expandedRow");
    return false;
  });

  $("#lineItemTable .collapseRowLink").live("click", function () {
    $(this).addClass("hidden");
    $(this).siblings(".expandRowLink").removeClass("hidden");
    $(this).parents("tr.expandableRow").removeClass("expandedRow");
    $(this)
      .parents("tr.expandableRow")
      .next(".lineItemExpandedRow")
      .attr("style", "display : none;");
    return false;
  });

  $("#quoteOptionDropdownLink").live("click", function () {
    $(this).siblings("#quoteOptionsList").toggle();
    return false;
  });
  $("#createNewQuoteLink").live("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#createNewQuotePopup").fadeIn("fast");
    return false;
  });

  $("#quoteOptionsList ul.quoteOptions a.popupLink").live("click", function () {
    var popupId = $(this).attr("link");
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".pageOverlay").fadeIn("fast");
    $("#" + popupId).fadeIn("fast");
    return false;
  });

  $(".renameQuote").live("click", function () {
    var quoteName = $("#renameQuotePopup .renameQuoteName").val();
    if (!validation("renameQuote")) {
      return false;
    }
    $("#quotesList option:selected").text(quoteName);
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
    return false;
  });

  $("#clearHeaderInfo").live("click", function () {
    $("#testingQuoteForm input.custId").val("");
    $("#testingQuoteForm .qouteOrgsArea").val("");
    $("#testingQuoteForm .qouteOrgsArea").attr("unid", "");
    $("#testingQuoteForm .quoteDesc").text("");
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
    return false;
  });

  $("#clearLineItems").live("click", function () {
    var newLineItem =
      "<tr class='lineItemRow'><td class='first-child'>1</td><td><input type='text' class='inputText rangeInput'></td><td><input type='text' class='inputText rangeInput'/></td><td></td><td></td><td></td><td></td><td></td><td></td><td class='last-child'><input type='text' class='inputText rangeInput'></td></tr>";
    $("#lineItemTable tbody.lineItemTbody").html(newLineItem);
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
    return false;
  });

  $("#createQuote").live("click", function () {
    isPriceQuoteCalculated = 0;
    var quoteName = $("#createNewQuotePopup .newQuoteName").val();
    if (!validation("createNewQuote")) {
      return false;
    }
    $("#quoteFormWrapper .quoteName").text(quoteName);
    $("#quotesList").append(new Option(quoteName));
    $("#quotesList").val(quoteName);
    $("#testingQuoteForm input.saveQuote").attr("isNew", true);
    $("#testingQuoteForm input.custId").val("");
    $("#testingQuoteForm .qouteOrgsArea").val("");
    $("#testingQuoteForm .qouteOrgsArea").attr("unid", "");
    $("#testingQuoteForm .quoteDesc").text("");
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var today = month + "/" + day + "/" + year;
    $("#testingQuoteForm input.quoteDate").val(today);

    var newLineItem =
      "<tr class='lineItemRow'><td class='first-child'>1</td><td><input type='text' class='inputText rangeInput'></td><td><input type='text' class='inputText rangeInput'/></td><td></td><td></td><td></td><td></td><td></td><td></td><td class='last-child'><input type='text' class='inputText rangeInput'></td></tr>";
    $("#lineItemTable tbody.lineItemTbody").html(newLineItem);

    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
  });

  $("#quotesList").live("change", function () {
    isPriceQuoteCalculated = 0;
    $("#testingQuoteForm input.saveQuote").attr("isNew", false);
    var params = { unid: $(this).val() };
    var href = $(".viewTraceImage a").attr("href");
    href = href.split("?");
    quoteGenerateTime = new Date().getTime();
    href =
      href[0] +
      "?filename=pricequote-" +
      $(this).val() +
      "-" +
      $(".userName").text() +
      "-" +
      quoteGenerateTime +
      ".txt";
    $(".viewTraceImage a").attr("href", href);
    loadTestingQuoteData(params);
  });

  function loadTestingQuoteData(params) {
    var url = "/testing-quote/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        //display UI data and hidden data
        if (typeof params.unid == "undefined") {
          loadAllTestingData(str.testingQuotes);
        }
        if (typeof str.testingQuotes[0] != "undefined") {
          if (typeof params.isMetaData == "undefined") {
            loadUITestingData(str.testingQuotes[0]);
          } else {
            var newParams = { unid: str.testingQuotes[0].unid };
            loadTestingQuoteData(newParams);
          }
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
        popAlert("Error while loading quote data");
      },
    });
  }

  function loadAllTestingData(quotes) {
    $("#quotesList").html("");
    $.each(quotes, function () {
      var unid = typeof this["unid"] != "undefined" ? this["unid"] : "";
      var name = typeof this["name"] != "undefined" ? this["name"] : "";
      var optionEle = $("<option>").val(unid).append(name);
      $("#quotesList").append(optionEle);
    });
  }

  function loadUITestingData(quote) {
    var custId = typeof quote["custId"] != "undefined" ? quote["custId"] : "";
    var groupId =
      typeof quote["groupId"] != "undefined" ? quote["groupId"] : "";
    var groupName =
      typeof quote["groupName"] != "undefined" ? quote["groupName"] : "";
    var customerName =
      typeof quote["customerName"] != "undefined" ? quote["customerName"] : "";
    var priceDate =
      typeof quote["priceDate"] != "undefined" ? quote["priceDate"] : "";
    var pricingSeqId =
      typeof quote["pricingSeqId"] != "undefined" ? quote["pricingSeqId"] : "";
    var unid = typeof quote["unid"] != "undefined" ? quote["unid"] : "";
    var quoteName = typeof quote["name"] != "undefined" ? quote["name"] : "";
    var optionalArgs =
      typeof quote["optionalArgs"] != "undefined" ? quote["optionalArgs"] : "";

    $("#quoteFormWrapper .quoteName").text(quoteName);
    $("#quoteFormWrapper .custId").val(custId);
    $("#quoteFormWrapper .quoteDate").val(priceDate);
    $("#quoteFormWrapper .quoteDesc").text(customerName);
    $("#quoteFormWrapper .quotePref").val(optionalArgs);
    $("#quoteFormWrapper .qouteOrgsArea").val(groupName);
    $("#quoteFormWrapper .qouteOrgsArea").attr("unid", groupId);
    $(
      '#quoteFormWrapper .pricingSeq option[value="' + pricingSeqId + '"]'
    ).attr("selected", "selected");
    $("#quoteFormWrapper .lineItemTbody").html("");
    $("#testingQuoteForm input.saveQuote").attr("isnew", false);
    var count = 1;
    $.each(quote.lineItems, function () {
      var productNumber =
        typeof this["productNumber"] != "undefined"
          ? this["productNumber"]
          : "";
      var productDesc =
        typeof this["productDesc"] != "undefined" ? this["productDesc"] : "";
      var unid = typeof this["unid"] != "undefined" ? this["unid"] : "";
      var productId =
        typeof this["productId"] != "undefined" ? this["productId"] : "";
      var quantity =
        typeof this["quantity"] != "undefined" ? this["quantity"] : 0;
      var price = typeof this["price"] != "undefined" ? this["price"] : 0;
      var optionalArgs =
        typeof this["optionalArgs"] != "undefined" ? this["optionalArgs"] : "";
      var row = $("<tr>").addClass("expandableRow lineItemRow");
      var totalPrice = parseFloat(quantity) * parseFloat(price);

      var idCol = $("<td>").addClass("first-child").append(count);
      var inputQ = $("<input>").addClass("inputText rangeInput").val(quantity);
      var quantityCol = $("<td>").append(inputQ);

      var inputPr = $("<input>")
        .addClass("inputText rangeInput")
        .val(productNumber);
      var productCol = $("<td>").append(inputPr);
      var prodNumCol = $("<td>").append(productDesc);
      var operandCol = $("<td>");
      var amountCol = $("<td>");
      var resultCol = $("<td>");
      var unitPrCol = $("<td>").append(price);
      var totalPrCol = $("<td>").append(totalPrice);

      var inputOpArg = $("<input>")
        .addClass("inputText rangeInput")
        .val(optionalArgs);
      var OpArgCol = $("<td>").append(inputOpArg);

      row
        .append(idCol)
        .append(quantityCol)
        .append(productCol)
        .append(prodNumCol)
        .append(operandCol);
      row
        .append(amountCol)
        .append(resultCol)
        .append(unitPrCol)
        .append(totalPrCol)
        .append(OpArgCol);
      $("#quoteFormWrapper .lineItemTbody").append(row);
      count++;
    });
  }

  $("#testingQuoteForm input.deleteQuote").live("click", function () {
    isPriceQuoteCalculated = 0;
    var params = { unid: $("#quotesList option:selected").val() };
    var url = "/testing-quote/delete";
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        if (typeof str.response.crudRes[0].message != "undefined")
          popAlert(str.response.crudRes[0].message);
        else {
          popAlert(str.response.message);
        }
        var params = { isMetaData: 1 };
        loadTestingQuoteData(params);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert(" error while delete quote");
      },
    });
  });

  $("#testingQuoteForm #priceQuoteBtn").live("click", function () {
    var params = getQuoteParams();
    var url = "/price-quote";
    var loadParams = { unid: params.unid };
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response.quotes[0].message);
        if (str.response.quotes[0].status != "Error") {
          loadUILineItems(str.response.quotes[0].lineItems);
        }
        isPriceQuoteCalculated = 1;
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        popAlert("Error while loading the price quote.");
      },
    });
    return false;
  });

  function loadUILineItems(lineItems) {
    $("#quoteFormWrapper .lineItemTbody").html("");
    $.each(lineItems, function () {
      var productNumber =
        typeof this["productNumber"] != "undefined"
          ? this["productNumber"]
          : "";
      var unid =
        typeof this["productID"] != "undefined" ? this["productID"] : "";
      var quantity =
        typeof this["quantity"] != "undefined" ? this["quantity"] : 0;
      var price = typeof this["price"] != "undefined" ? this["price"] : 0;
      var optionalArgs =
        typeof this["optionalArgs"] != "undefined" ? this["optionalArgs"] : "";
      var row = $("<tr>").addClass("expandableRow lineItemRow");
      var totalPrice = parseFloat(quantity) * parseFloat(price);

      var idCol = $(
        '<td class="first-child"><a href="" class="expandRowLink"><img src="resources/images/expand-row.png"></a><a href="" class="collapseRowLink hidden"><img src="resources/images/collapse-row.png"></a>'
      ).append(unid);
      var inputQ = $("<input>").addClass("inputText rangeInput").val(quantity);
      var quantityCol = $("<td>").append(inputQ);

      var inputPr = $("<input>")
        .addClass("inputText rangeInput")
        .val(productNumber);
      var productCol = $("<td>").append(inputPr);
      var prodNumCol = $("<td>");
      var operandCol = $("<td>");
      var amountCol = $("<td>");
      var resultCol = $("<td>");
      var unitPrCol = $("<td>").append(price);
      var totalPrCol = $("<td>").append(totalPrice);

      var inputOpArg = $("<input>")
        .addClass("inputText rangeInput")
        .val(optionalArgs);
      var OpArgCol = $("<td>").append(inputOpArg);

      row
        .append(idCol)
        .append(quantityCol)
        .append(productCol)
        .append(prodNumCol)
        .append(operandCol);
      row
        .append(amountCol)
        .append(resultCol)
        .append(unitPrCol)
        .append(totalPrCol)
        .append(OpArgCol);
      $("#quoteFormWrapper .lineItemTbody").append(row);
      var pricingTypes = this["pricingTypes"];
      if (pricingTypes.length > 0) {
        var count = 1;
        var lineItemsAttr =
          "<tr class='lineItemExpandedRow' style='display:none;'><td colspan='3' class='first-child'></td><td colspan='6' style='padding:0px'><table class='lineItemExpandedTable' id=row_" +
          unid +
          "></table></td><td class='last-child'></td></tr>";
        $("#quoteFormWrapper .lineItemTbody").append(lineItemsAttr);
        $.each(pricingTypes, function () {
          var rowClass = "odd";
          if (count % 2 == 0) rowClass = "even";
          var description =
            typeof this["description"] != "undefined"
              ? this["description"]
              : "-";
          var punid = typeof this["unId"] != "undefined" ? this["unId"] : "";
          var operand =
            typeof this["operand"] != "undefined" ? this["operand"] : 0;
          var amount =
            typeof this["amount"] != "undefined" ? this["amount"] : 0;
          var result =
            typeof this["result"] != "undefined" ? this["result"] : 0;
          var subRow = $("<tr>").addClass(rowClass);
          var descriptionEle = $("<td>")
            .addClass("rowHeader descriptionTD first-child")
            .append(description);
          var operandEle = $("<td>").addClass("operandTD").append(operand);
          var amountEle = $("<td>").addClass("amountTD").append(amount);
          var resultEle = $("<td>").addClass("resultTD").append(result);
          var unitPriceEle = $("<td>").addClass("unitPriceTD").append("-");
          var totalPriceEle = $("<td>")
            .addClass("totalPriceTD last-child")
            .append("-");
          subRow
            .append(descriptionEle)
            .append(operandEle)
            .append(amountEle)
            .append(resultEle)
            .append(unitPriceEle)
            .append(totalPriceEle);
          $("tr.lineItemExpandedRow table#row_" + unid).append(subRow);
          count++;
        });
      }
    });
  }

  function getQuoteParams() {
    var unid = $("#quotesList option:selected").val();
    var name = $("#quotesList option:selected").text();
    var custId = $("#testingQuoteForm input.custId").val();
    var groupId = $("#testingQuoteForm .qouteOrgsArea").attr("unid");
    var date = $("#testingQuoteForm input.quoteDate").val();
    var pricingSeq = $("#testingQuoteForm .pricingSeq").val();
    var quotePref = $("#testingQuoteForm input.quotePref").val();
    //href = href[0]+"?filename=pricequote-"+$(this).val()+"-"+$(".userName").text()+"-"+quoteGenerateTime+".txt";
    var d = new Date();
    var timeStamp = formatTime(d);
    quoteGenerateTime =
      d.getDate() +
      "-" +
      d.getMonth() +
      "-" +
      d.getFullYear() +
      "_" +
      timeStamp;
    var lineItems = getAllLineItems();
    var params = {
      unid: unid,
      name: name,
      custId: custId,
      groupId: groupId,
      date: date,
      pricingSeq: pricingSeq,
      quotePref: quotePref,
      lineItems: lineItems,
      quoteGenerateTime: quoteGenerateTime,
    };
    var href = $(".viewTraceImage a").attr("href");
    href = href.split("?");
    href =
      href[0] +
      "?filename=pricequote-" +
      unid +
      "-" +
      $(".userName").text() +
      "-" +
      quoteGenerateTime +
      ".txt";
    $(".viewTraceImage a").attr("href", href);
    return params;
  }

  function getAllLineItems() {
    var dataRows = [];
    $("#testingQuoteForm tbody.lineItemTbody tr.lineItemRow").each(function (
      index,
      value
    ) {
      var currentRow = getLineItemRow(index);
      if (currentRow.quantity == "") {
        currentRow.quantity = "1";
      }
      if (!(currentRow.product_number == ""))
        dataRows.push(JSON.stringify(currentRow));
    });
    return dataRows;
  }

  function getLineItemRow(rowNum) {
    var tableRow = $("#testingQuoteForm tbody.lineItemTbody tr.lineItemRow").eq(
      rowNum
    );
    var row = {};
    row.unid = tableRow.find("td:eq(0)").text();
    if (row.unid == "") {
      row.unid = "1";
    }
    row.quantity = tableRow.find("td:eq(1) input").val();
    row.product_number = tableRow.find("td:eq(2) input").val();
    row.product_desc = tableRow.find("td:eq(3)").text();
    row.price = tableRow.find("td:eq(7)").text();
    row.optional_args = tableRow.find("td:eq(9) input").val();
    return row;
  }
  $("#testingQuoteForm input.saveQuote").live("click", function () {
    if (!validation("testingQuoteForm")) {
      return false;
    }
    var params = getQuoteParams();
    var url = "/testing-quote/add";
    var loadParams = { isMetaData: 1 };
    if ($("#testingQuoteForm input.saveQuote").attr("isnew") == "false") {
      url = "/testing-quote/edit";
      loadParams = { unid: params.unid };
    }
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response.crudRes[0].message);
        loadTestingQuoteData(loadParams);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while saving the quote.");
      },
    });
    return false;
  });

  /*    $("#viewTraceBtn").live('click', function(){
        if(isPriceQuoteCalculated != 1) {
             $('.viewTraceImage a').bind('click',function(event){
                    event.preventDefault();
                    return false;
                });
        }
            else {
                 $('.viewTraceImage a').unbind('click',function(event){
                        event.preventDefault();
                        return false;
                    });
            }

        //return false;
    });  */

  function disabler(event) {
    event.preventDefault();
    return false;
  }

  $(".viewTraceImage a").live("click", disabler);

  $("#traceQuote").live("click", function () {
    if ($(this).is(":checked")) {
      $(".viewTraceImage").attr("style", "opacity:1;");
      $("#viewTraceBtn").attr("style", "cursor: pointer");
      $(".viewTraceImage a").die("click", disabler);
    } else {
      $(".viewTraceImage").attr("style", "opacity:0.4;");
      $("#viewTraceBtn").attr("style", "cursor: text");
      $(".viewTraceImage a").live("click", disabler);
    }
  });

  $(".prefTypeDropDown").live("change", function () {
    var tagId = $(this).closest("tr").attr("id");
    var tags = tagId.split("-");
    var unid = tags[1];
    var id = $("#preferenceTypeDD-" + unid + " option:selected").text();
    $("#preferencesNameDD-" + unid).html(new Option("Choose Pref", "-1"));
    $("#preferencesIdDD-" + unid).html(new Option("Choose Pref ID", "-1"));
    $("#" + id)
      .children("span")
      .each(function () {
        var o = new Option($(this).text(), $(this).attr("unid"));
        var obj = new Option($(this).attr("unid"), $(this).text());
        $("#preferencesNameDD-" + unid).append(o);
        $("#preferencesIdDD-" + unid).append(obj);
      });
  });

  $(".prefNameDropDown").live("change", function () {
    var tagId = $(this).closest("tr").attr("id");
    var tags = tagId.split("-");
    var unid = tags[1];
    var theText = $("#preferencesNameDD-" + unid + " option:selected").text();
    $("#preferencesIdDD-" + unid).val(theText);
  });

  $(".prefIdDropDown").live("change", function () {
    var tagId = $(this).closest("tr").attr("id");
    var tags = tagId.split("-");
    var unid = tags[1];
    var theText = $("#preferencesIdDD-" + unid + " option:selected").text();
    $("#preferencesNameDD-" + unid).val(theText);
  });

  $("#addPricingPreferenceLink").live("click", function () {
    var productIDNext = 1;
    var element = $("#pricingPrefBody tr");
    var tagId = element
      .last()
      .find("td:eq(0) select.prefTypeDropDown")
      .attr("id");
    var tags = tagId.split("-");
    var productIDLast = tags[1];
    if (productIDLast) {
      productIDNext = parseInt(productIDLast) + 1;
    }
    var prefernceAdded =
      "<tr class='newPrefRow' id='pricingPref-" +
      productIDNext +
      "'><td><select class='inputText popTableSelect prefTypeDropDown'" +
      " id='preferenceTypeDD-" +
      productIDNext +
      "'><option selected='selected' value='-1'>Choose type</option>" +
      "</td><td><select class='inputText popTableSelect prefIdDropDown' id='preferencesIdDD-" +
      productIDNext +
      "'><option selected='" +
      "selected' value='-1'>Choose Pref ID</option></select></td><td>" +
      "<select class='inputText popTableSelect prefNameDropDown' id='preferencesNameDD-" +
      productIDNext +
      "'>" +
      "<option selected='selected'>Choose Pref</option></select></td><td><input type='text' " +
      "class='inputText popTableInputText'/></td><td></td><td><a href='#' " +
      "class='deletePricingPref'><img src='resources/images/deleteRow.png' " +
      "alt='Delete'></a></td></tr>";
    $("#pricingPrefTable tbody").append(prefernceAdded);
    $("#pricingPrefData")
      .children("div")
      .each(function () {
        var o = new Option($(this).attr("id"), $(this).attr("unid"));
        $("#preferenceTypeDD-" + productIDNext).append(o);
      });
    $("#pricingPreferencePopup .popupFormField").animate(
      {
        scrollTop: $("#pricingPreferencePopup .popupFormField table").height(),
      },
      "fast"
    );
    return false;
  });

  $("#savePricingPreference").live("click", function () {
    var params = { preferences: getPrefParams() };
    var url = "/preferences/add";
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response[0].message);
        getPreferences();
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while saving the pricing preference.");
      },
    });
    return false;
  });

  function getPrefParams() {
    var dataRows = [];
    $("#pricingPrefBody tr").each(function (index, value) {
      var currentRow = getPreferenceRow(index);
      if (
        !(
          currentRow.type == "-1" ||
          currentRow.prefId == "-1" ||
          currentRow.name == "-1"
        )
      )
        dataRows.push(JSON.stringify(currentRow));
    });
    return dataRows;
  }

  function getPreferenceRow(rowNum) {
    var tableRow = $("#pricingPrefBody tr").eq(rowNum);
    var row = {};
    row.type = tableRow
      .find("td:eq(0) select.prefTypeDropDown option:selected")
      .val();
    row.name = tableRow
      .find("td:eq(1) select.prefIdDropDown option:selected")
      .val();
    row.pref_id = tableRow
      .find("td:eq(2) select.prefNameDropDown option:selected")
      .val();
    row.pref_value = tableRow.find("td:eq(3) input").val();
    row.unid = tableRow.find("td:eq(4)").text();
    return row;
  }

  $("#pricingPrefTable .deletePricingPref").live("click", function () {
    var tagId = $(this).closest("tr").attr("id");
    var tags = tagId.split("-");
    var unid = tags[1];
    //Call delete pricing pref
    var params = { unid: unid };
    var url = "/preferences/delete";
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response[0].message);
        getPreferences();
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while deleting the pricing-preference.");
      },
    });
  });

  function getPreferences() {
    var url = "/preferences/get";
    jQuery.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      success: function (str) {
        loadPreferences(str.preferences.preferences);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while loadinng the pricing-preferences.");
      },
    });
  }

  function loadPreferences(preferences) {
    $("#pricingPrefBody").html("");
    $.each(preferences, function () {
      var unid = typeof this["unid"] != "undefined" ? this["unid"] : "";
      var name = typeof this["name"] != "undefined" ? this["name"] : "";
      var prefId = typeof this["prefId"] != "undefined" ? this["prefId"] : "";
      var prefValue =
        typeof this["prefValue"] != "undefined" ? this["prefValue"] : "";
      var type = typeof this["type"] != "undefined" ? this["type"] : "";

      var body = $("<tr>").attr("id", "pricingPref-" + unid);

      var typeDropDownEle = $(
        '<select class="inputText popTableSelect prefTypeDropDown">'
      ).attr("id", "preferenceTypeDD-" + unid);
      typeDropDownEle.append("<option>Choose type</option>");
      var selectedTypeId = "";
      $("#pricingPrefData")
        .children("div")
        .each(function () {
          var o = $("<option>")
            .attr("value", $(this).attr("unid"))
            .append($(this).attr("id"));
          if ($(this).attr("unid") == type) {
            o.attr("selected", "selected");
            selectedTypeId = $(this).attr("id");
          }
          typeDropDownEle.append(o);
        });
      var typeEle = $("<td>").append(typeDropDownEle);

      var prefIdDropDownEle = $(
        '<select class="inputText popTableSelect prefIdDropDown">'
      ).attr("id", "preferencesIdDD-" + unid);
      prefIdDropDownEle.append("<option>Choose Pref ID</option>");
      var prefNameDropDownEle = $(
        '<select class="inputText popTableSelect prefNameDropDown">'
      ).attr("id", "preferencesNameDD-" + unid);
      prefNameDropDownEle.append("<option>Choose Pref</option>");
      $("#" + selectedTypeId)
        .children("span")
        .each(function () {
          var o = $("<option>")
            .attr("value", $(this).attr("unid"))
            .append($(this).text());
          var obj = $("<option>")
            .attr("value", $(this).text())
            .append($(this).attr("unid"));
          if ($(this).attr("unid") == prefId) {
            o.attr("selected", "selected");
            obj.attr("selected", "selected");
          }
          prefNameDropDownEle.append(o);
          prefIdDropDownEle.append(obj);
        });

      var prefIdEle = $("<td>").append(prefIdDropDownEle);
      var nameEle = $("<td>").append(prefNameDropDownEle);
      var inputEle = $('<input type="text">')
        .addClass("inputText popTableInputText")
        .val(prefValue);
      var prefValueEle = $("<td>").append(inputEle);
      var unidEle = $("<td>").append(unid);
      var deleteEle = $("<td>").append(
        '<a href="#" class="deletePricingPref"><img src="resources/images/deleteRow.png" alt="Delete"/></a>'
      );

      body
        .append(typeEle)
        .append(prefIdEle)
        .append(nameEle)
        .append(prefValueEle);
      body.append(unidEle).append(deleteEle);

      $("#pricingPrefBody").append(body);
    });
  }

  $("html").live("click", function (e) {
    $(".configTableDropdown, .helpDropdown, .allFiltersList").hide();
  });
  /*---- Delete token code ---- */
  $(".deleteToken").live("click", function () {
    var itemId = $(this).parents("li").attr("itemId");
    var unid = $(this)
      .parents(".tokenList")
      .siblings(".tokenInputText")
      .attr("unid");
    var itemIndex = unid.search(itemId);
    if (
      itemIndex + itemId.length == unid.length &&
      itemId.length != unid.length
    ) {
      unid = unid.replace(":" + itemId, "");
    } else if (
      itemIndex + itemId.length == unid.length &&
      itemId.length == unid.length
    ) {
      unid = unid.replace(itemId, "");
    } else {
      unid = unid.replace(itemId + ":", "");
    }
    if ($(this).parents(".tokenList").hasClass("tableDataDND")) {
      $(".dropDNDName").empty();
    }
    $(this)
      .parents(".tokenList")
      .siblings(".tokenInputText")
      .attr("unid", unid);
    $(this).parents("li").remove();
    return false;
  });
  //For Tab Selection state saving
  $(".checkboxTab").live("click", function () {
    if (this.id == "masterDataVisual") {
      if ($(this).is(":checked")) {
        addLayoutConfiguration("visible", "VIEW_TAB_MASTER_DATA");
      } else {
        addLayoutConfiguration("none", "VIEW_TAB_MASTER_DATA");
      }
    } else if (this.id == "pricingTypeVisual") {
      if ($(this).is(":checked")) {
        addLayoutConfiguration("visible", "VIEW_TAB_PRICING_TYPES_N_SEQ");
      } else {
        addLayoutConfiguration("none", "VIEW_TAB_PRICING_TYPES_N_SEQ");
      }
    } else if (this.id == "groupComboVisual") {
      if ($(this).is(":checked")) {
        addLayoutConfiguration("visible", "VIEW_TAB_GROUP_COMBO");
      } else {
        addLayoutConfiguration("none", "VIEW_TAB_GROUP_COMBO");
      }
    } else if (this.id == "testingVisual") {
      if ($(this).is(":checked")) {
        addLayoutConfiguration("visible", "VIEW_TAB_TESTING");
      } else {
        addLayoutConfiguration("none", "VIEW_TAB_TESTING");
      }
    } else if (this.id == "hierarchyVisual") {
      if ($(this).is(":checked")) {
        addLayoutConfiguration("visible", "VIEW_TAB_HIERARCHIES");
      } else {
        addLayoutConfiguration("none", "VIEW_TAB_HIERARCHIES");
      }
    }
  });
  //for configuration saving
  $("#configurationBtn").live("click", function () {
    if ($(".confTab1").parents("li").hasClass("active")) {
      var productsMasterNameCheck = $("#getProductsMasterNameCheck").is(
        ":checked"
      )
        ? "checked"
        : "unchecked";
      addLayoutConfiguration(
        productsMasterNameCheck,
        "GET_PRD_MASTER_NAME",
        "/configuration/update"
      );
      $("#defaultConfigurationData")
        .children("#getProductsMasterNameCheckDefault")
        .text(
          $("#getProductsMasterNameCheck").is(":checked")
            ? "checked"
            : "unchecked"
        );
      // var showTableIdTreeCheck = $("#showTableIdTreeCheck").is(":checked")
      //   ? "checked"
      //   : "unchecked";
      // var showTableIdDialogCheck = $("#showTableIdDialogCheck").is(":checked")
      //   ? "checked"
      //   : "unchecked";
      // var effDateFrom = $("#effDateFrom").val();
      // var effDateTo = $("#effDateTo").val();
      // $("#defStartDate").html(effDateFrom);
      // $("#defEndDate").html(effDateTo);

      // addLayoutConfiguration(
      //   showTableIdTreeCheck +
      //     "," +
      //     showTableIdDialogCheck +
      //     "," +
      //     effDateFrom +
      //     "," +
      //     effDateTo,
      //   "TABLE_UNIQUE_ID_IN_TREE,TABLE_UNIQUE_ID_IN_DIALOGS,EFF_DATE_FROM,EFF_DATE_TO",
      //   "/configuration/update"
      // );
      // showTblIdTreeCheck = $("#defaultConfigurationData")
      //   .children("#showTableIdTreeCheckDefault")
      //   .text();
      // $("#defaultConfigurationData")
      //   .children("#showTableIdTreeCheckDefault")
      //   .text(
      //     $("#showTableIdTreeCheck").is(":checked") ? "checked" : "unchecked"
      //   );
      // $("#defaultConfigurationData")
      //   .children("#effDateFromDefault")
      //   .text(effDateFrom);
      // $("#defaultConfigurationData")
      //   .children("#effDateToDefault")
      //   .text(effDateTo);
      // $("#defaultConfigurationData")
      //   .children("#showTableIdDialogCheckDefault")
      //   .text(
      //     $("#showTableIdDialogCheck").is(":checked") ? "checked" : "unchecked"
      //   );
      // // if(showTblIdTreeCheck!=showTableIdTreeCheck){
      // $.jstree._reference($("#productHierarchy")).close_all(-1);
      // $.jstree._reference($("#organizationHierarchy")).close_all(-1);
      // $.jstree._reference($("#productHierarchy")).refresh(-1);
      // $.jstree._reference($("#organizationHierarchy")).refresh(-1);
      // //}
    } else if ($(".confTab2").parents("li").hasClass("active")) {
      var productsMasterNameCheck = $("#getProductsMasterNameCheck").is(
        ":checked"
      )
        ? "checked"
        : "unchecked";
      addLayoutConfiguration(
        productsMasterNameCheck,
        "GET_PRD_MASTER_NAME",
        "/configuration/update"
      );
      $("#defaultConfigurationData")
        .children("#getProductsMasterNameCheckDefault")
        .text(
          $("#getProductsMasterNameCheck").is(":checked")
            ? "checked"
            : "unchecked"
        );
    }
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
  });

  $("#loginButton").on("click", function (event) {
    if (validation("authenticate")) {
      $("#authenticate").submit();
    } else {
      return false;
    }
  });
  $("#alertButton").live("click", function () {
    $("#alertPopup").fadeOut("fast");
    $(".pageOverlay").fadeOut("fast");
    return false;
  });

  // Close the success/error notification at the top of page
  $(".closeInnerNotif").live("click", function () {
    $(".errorMessageDiv").hide();
    return false;
  });
  //Button click event for trace engine during logon
  $("#engineTraceFile").live("click", function () {
    location.href = "/configuration/engine-trace-file";
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
  });

  //Button click event for pricing type delete of pricing sequence
  $("#deletePricingSeqsPType").live("click", function () {
    selId = $("span#pricingSequencePTypeUnid").text();
    newRow = $("span#newRow").text();
    parentId = $("span#parentPricingSequenceUnid").text();
    if (
      newRow == "false" &&
      typeof parentId !== "undefined" &&
      parentId !== false
    ) {
      deletePricingTypeRow(parentId, selId);
    }
    $("#pricingTypeId_" + selId + "_" + parentId).remove();
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
    return false;
  });
  $(".deletePricingTypeRow").live("click", function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      "slow"
    );
    $(".pageOverlay").fadeIn("fast");
    $("#deletePricingSequencePricingType").fadeIn("fast");
    var name = $(this).parent().siblings(".pricingTypeCol").html();
    var seqIdAttr = $(this).parents("tr.pricingSeqOperation").attr("seqId");
    $("span.deletePricingSeqPricingType").text(name);
    $("span#newRow").text(
      $(this).parents("tr.pricingSeqOperation").attr("newRow")
    );
    $("span#pricingSequencePTypeUnid").text(
      $(this).parents("tr.pricingSeqOperation").attr("id").split("_")[1]
    );
    if (typeof seqIdAttr !== "undefined" && seqIdAttr !== false) {
      $("span#parentPricingSequenceUnid").text(
        $(this).parents("tr.pricingSeqOperation").attr("seqId").split("_")[1]
      );
    }
    return false;
  });
  $("#customerTablePagination").ready(function () {
    hidePagination("customerTablePagination ");
  });
  $("#productsTablePagination").ready(function () {
    hidePagination("productsTablePagination ");
  });
  $("#adjustmentsTablePagination").ready(function () {
    hidePagination("adjustmentsTablePagination ");
  });
  function deletePricingTypeRow(seqId, pTypeId) {
    var params = {
      seqId: seqId,
      pTypeId: pTypeId,
    };
    var url = "/pricing-sequence/pricing-type/delete";
    jQuery.ajax({
      type: "POST",
      url: url,
      data: params,
      dataType: "json",
      success: function (str) {
        popSuccessMessage(str.response[0].message);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message form the Server
        popAlert("Error while deleting the pricing-type.");
      },
    });
  }
  /** To Get the Customer SearchData **/
  function loadCustomerSearchData(params) {
    jQuery.ajax({
      type: "POST",
      url: "/customers/search",
      data: params,
      dataType: "json",
      success: function (str) {
        $("span.noCustRecord").hide();
        if (str.customers.totalRecords == 0) {
          $("span.noCustRecord").show();
        }
        $("#totalCustomers").html(
          "Customers - showing " +
            str.customers.listSize +
            " of " +
            str.customers.totalRecords
        );
        var totalPages = str.customers.totalRecords / customerRecordsPerPage;
        $("#customerRecordTable span.totalPage").text(Math.ceil(totalPages));
        hidePagination("customerTablePagination");
        $(".customerPaginationData span.startIndex").text(params.startIndex);
        $(".customerPaginationData span.endIndex").text(params.endIndex);
        loadAllCustomerData(str.customers.customerList);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
      },
    });
  }
  /** To Get Product Search Data **/
  function loadProductSearchData(params) {
    jQuery.ajax({
      type: "POST",
      url: "/product/search",
      data: params,
      dataType: "json",
      success: function (str) {
        $("span.noProdRecord").hide();
        if (str.products.totalRecords == 0) {
          $("span.noProdRecord").show();
        }
        $("#totalProducts").html(
          "Products - showing " +
            str.products.listSize +
            " of " +
            str.products.totalRecords
        );
        var totalPages = str.products.totalRecords / productRecordsPerPage;
        $("#productsRecordTable span.totalPage").text(Math.ceil(totalPages));
        hidePagination("productPaginationData");
        loadAllProductData(str.products.productList);
        $(".productPaginationData span.startIndex").text(params.startIndex);
        $(".productPaginationData span.endIndex").text(params.endIndex);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
      },
    });
  }
  /** To load the Adjustment Search Data **/
  function loadAdjustmentSearchData(params) {
    jQuery.ajax({
      type: "POST",
      url: "/adjustments/search",
      data: params,
      dataType: "json",
      success: function (str) {
        $("span.noAdjRecord").hide();
        if (str.adjustments.totalRecords == 0) {
          $("span.noAdjRecord").show();
        }
        $("#totalAdjustments").html(
          "Adjustments - showing " +
            str.adjustments.listSize +
            " of " +
            str.adjustments.totalRecords
        );
        var totalPages =
          str.adjustments.totalRecords / adjustmentRecordsPerPage;
        $("#adjustmentRecordTable span.totalPage").text(Math.ceil(totalPages));
        hidePagination("adjustmentsTablePagination");
        loadAllAdjustment(str.adjustments.adjustments);
        $(".adjustmentPaginationData span.startIndex").text(params.startIndex);
        $(".adjustmentPaginationData span.endIndex").text(params.endIndex);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // TODO: need to show error message
      },
    });
  }
  /** To get the attribute data **/
  function getAttrDatas(formId, attrCls) {
    var dataRows = [];
    $("#" + formId + " tbody." + attrCls + " tr.attrRow").each(function (
      index,
      value
    ) {
      var currentRow = getAttrRow(index, formId, attrCls);
      dataRows.push(JSON.stringify(currentRow));
    });
    return dataRows;
  }
  function getAttrRow(rowNum, formId, attrCls) {
    var tableRow = $("#" + formId + " tbody." + attrCls + " tr.attrRow").eq(
      rowNum
    );
    var row = {};
    row.name = tableRow.find("td:eq(0)").attr("colname");
    row.value = tableRow.find("td:eq(1) input").val();
    return row;
  }
  // Column Configuration Button
  $(".chooseColBtn").live("click", function () {
    var colName = "";
    var dispVal = "";
    var colDiv = "";
    var colTblDisp = "";
    var colTblNotDisp = "";
    if ($("#chooseColumnHeader").html() == chooseColCustomer) {
      colDiv = "custcolumnhide";
      colTblDisp = "customerTableDisplayed";
      colTblNotDisp = "customerTableNotDisplayed";
    } else if ($("#chooseColumnHeader").html() == chooseColProduct) {
      colDiv = "prodcolumnhide";
      colTblDisp = "productTableDisplayed";
      colTblNotDisp = "productTableNotDisplayed";
    } else if ($("#chooseColumnHeader").html() == chooseColAdjustment) {
      colDiv = "adjcolumnhide";
      colTblDisp = "adjustmentTableDisplayed";
      colTblNotDisp = "adjustmentTableNotDisplayed";
    }
    $("#" + colDiv + " #" + colTblNotDisp).html("");
    $("#choosecolumn #columnNotDisplayed option").each(function () {
      colName += $(this).val() + ",";
      dispVal += "none,";
      colId = getColumnIndexesById($(this).val());
      tblID = $("#" + $(this).val())
        .parents(".recordsTable")
        .attr("id");
      $(
        "#" +
          tblID +
          " td:nth-child(" +
          colId +
          "),#" +
          tblID +
          " th:nth-child(" +
          colId +
          ")"
      ).hide();
      var o = new Option($(this).text(), $(this).val());
      $("#" + colDiv + " #" + colTblNotDisp).append(o);
    });
    $("#" + colDiv + " #" + colTblDisp).html("");
    $("#choosecolumn #columnDisplayed option").each(function () {
      colName += $(this).val() + ",";
      dispVal += "visible,";
      colId = getColumnIndexesById($(this).val());
      tblID = $("#" + $(this).val())
        .parents(".recordsTable")
        .attr("id");
      $(
        "#" +
          tblID +
          " td:nth-child(" +
          colId +
          "),#" +
          tblID +
          " th:nth-child(" +
          colId +
          ")"
      ).show();
      var o = new Option($(this).text(), $(this).val());
      $("#" + colDiv + " #" + colTblDisp).append(o);
    });
    if (colName.indexOf(",") >= 0) {
      colName = colName.substring(0, colName.length);
      dispVal = dispVal.substring(0, dispVal.length);
    }
    addLayoutConfiguration(dispVal, colName);
    $(".pageOverlay").fadeOut("fast");
    $(".popupWrapper").fadeOut("fast");
  });
});

function validation(formId) {
  $(".validationMsg").hide();
  var isValid = true;
  var inputMandatory = $("#" + formId + " .inputText.mandatory");
  if (formId == "createAdjustment" || formId == "editAdjustment") {
    if (
      $("#" + formId + " .adjCustId").val() == "" &&
      $("#" + formId + "  .adjOrgs").attr("unid") == ""
    ) {
      isValid = false;
      $(".adjOrgs")
        .parent()
        .siblings("#" + formId + " .validationMsgMultiple")
        .show();
    }
    if (
      $("#" + formId + " input.adjProdId").val() == "" &&
      $("#" + formId + " input.adjProdGroups").attr("unid") == ""
    ) {
      isValid = false;
      $(".adjProdGroups").parent().siblings(".validationMsgMultiple").show();
    }
  }
  if (
    formId == "createProductAttributeForm" ||
    formId == "customerAttributeForm"
  ) {
    if (!$(".optionOne").is(":checked") && !$(".optionTwo").is(":checked")) {
      isValid = false;
      $("#" + formId + " .optionTwo")
        .parent()
        .siblings(".validationMsg")
        .css("display", "inline-block");
    }
  }
  if (formId == "createGroupComboForm" || formId == "editGroupComboForm") {
    if ($("#" + formId + " div.groupComboTypeDivWrapper").attr("unid") == "") {
      isValid = false;
      $("#" + formId + " .optionTwo")
        .parent()
        .siblings(".validationMsg")
        .css("display", "inline-block");
    }
  }
  var startDate = new Date($("#" + formId + " input.startDate").val());
  var endDate = new Date($("#" + formId + " input.endDate").val());
  if (startDate > endDate) {
    isValid = false;
    $("#" + formId + " input.startDate")
      .siblings(".validationMsg")
      .show();
  }
  inputMandatory.each(function (i) {
    if ($(this).val() == "") {
      isValid = false;
      $(this).siblings(".validationMsg").show();
      $(this).parents(".jsTokenWrapper").siblings(".validationMsg").show();
      // return false;
    }
  });
  if (!isValid) {
    return false;
  } else {
    return true;
  }
}
function validateNumeric(formId) {
  var isValid = true;
  var inputNumeric = $("#" + formId + " .inputText.numeric");
  inputNumeric.each(function (i) {
    if (!isDecimal($(this).val())) {
      isValid = false;
      $(this).siblings(".validationMsg").show();
    }
  });
  if (!isValid) {
    return false;
  } else {
    return true;
  }
}

function dragNDrop() {
  $(".customer-id-drop").droppable({
    activeClass: "ui-state-default",
    hoverClass: "ui-state-hover",
    accept: "#customerRecordsTable tbody tr",
    drop: function (event, ui) {
      if ($(this).hasClass("adjCustId")) {
        var formId = $(this).parents("form").attr("id");
        $(this).val(ui.draggable.children(".customer-id").text());
        $("#" + formId + " ul#customerId").empty();
        var li = $("<li>")
          .attr("itemid", $(this).text())
          .text(ui.draggable.children(".customer-id").text());
        var an = $("<a>")
          .attr("href", "")
          .addClass("deleteToken")
          .append(
            $("<img>").attr("src", "resources/images/deleteInputToken.png")
          );
        li.append(an);
        $("#" + formId + " ul#customerId").append(li);
        $(this)
          .parents("tr")
          .siblings(".customer-name-field-row")
          .children(".customer-name")
          .text(ui.draggable.children(".customer-name").text());
      } else if ($(this).hasClass("proSrcCustId")) {
        $("#prodAdvanceSearch .proSrcCustId").siblings("ul.tokenList").empty();
        var li = $("<li>")
          .attr("itemid", $(this).text())
          .text(ui.draggable.children(".customer-id").text());
        var an = $("<a>")
          .attr("href", "")
          .addClass("deleteToken")
          .append(
            $("<img>").attr("src", "resources/images/deleteInputToken.png")
          );
        li.append(an);
        $("#prodAdvanceSearch .proSrcCustId")
          .siblings("ul.tokenList")
          .append(li);
        $(this).val(ui.draggable.children(".customer-id").text());
        $("#proSrcCustName").text(
          ui.draggable.children(".customer-name").text()
        );
      } else if ($(this).hasClass("adjSerCustId")) {
        $("#adjAdvanceSearch .adjSerCustId").siblings("ul.tokenList").empty();
        var li = $("<li>")
          .attr("itemid", $(this).text())
          .text(ui.draggable.children(".customer-id").text());
        var an = $("<a>")
          .attr("href", "")
          .addClass("deleteToken")
          .append(
            $("<img>").attr("src", "resources/images/deleteInputToken.png")
          );
        li.append(an);
        $("#adjAdvanceSearch .adjSerCustId")
          .siblings("ul.tokenList")
          .append(li);
        $(this).val(ui.draggable.children(".customer-id").text());
        $("#advSearchCustName").text(
          ui.draggable.children(".customer-name").text()
        );
      } else if ($(this).hasClass("customerGroupId")) {
        $(".customerGroupId").siblings("ul.tokenList").empty();
        var li = $("<li>")
          .attr("itemid", ui.draggable.children(".customer-id").text())
          .text(ui.draggable.children(".customer-id").text());
        var an = $("<a>")
          .attr("href", "")
          .addClass("deleteToken")
          .append(
            $("<img>").attr("src", "resources/images/deleteInputToken.png")
          );
        li.append(an);
        $(".customerGroupId").siblings("ul.tokenList").append(li);
        $(this).val(ui.draggable.children(".customer-id").text());
        $(".customerNameVal").text(
          ui.draggable.children(".customer-name").text()
        );
      }
    },
  });
  $(".product-id-drop").droppable({
    activeClass: "ui-state-default",
    hoverClass: "ui-state-hover",
    accept: "#productsRecordsTable tbody tr",
    drop: function (event, ui) {
      if ($(this).hasClass("adjProdId")) {
        $(".adjProdId").siblings("ul.tokenList").empty();
        var li = $("<li>")
          .attr(
            "itemid",
            ui.draggable
              .children(".product-name")
              .parent()
              .attr("id")
              .substr("5")
          )
          .text(
            ui.draggable
              .children(".product-name")
              .parent()
              .attr("id")
              .substr("5")
          );
        var an = $("<a>")
          .attr("href", "")
          .addClass("deleteToken")
          .append(
            $("<img>").attr("src", "resources/images/deleteInputToken.png")
          );
        li.append(an);
        $(".adjProdId").siblings("ul.tokenList").append(li);
        $(this).val(
          ui.draggable.children(".product-name").parent().attr("id").substr("5")
        );
      } else {
        $(this).val(ui.draggable.children(".org-id").text());
      }
    },
  });
}
function resetDraggable() {
  $("#customerRecordsTable tbody tr").draggable({
    appendTo: "body",
    helper: "clone",
    zIndex: 20,
  });
  $("#productsRecordTable tbody tr").draggable({
    appendTo: "body",
    helper: "clone",
    zIndex: 20,
  });
}
//Function to validate the operation selection for pricing type
function pricingOperationValidation(dropDownId) {
  $(dropDownId).siblings(".validationMsg").hide();
  if ($(dropDownId).find(":selected").val() == "0") {
    $(dropDownId).siblings(".validationMsg").show();
    return false;
  } else {
    return true;
  }
}

function popupWindow(url) {
  var popUpUrl = url + "?isPopup=true";
  window.open(
    popUpUrl,
    "popUpWindow" + popUpUrl,
    "height=700,width=1000,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes"
  );
}
function updateLayout(usrLayout) {
  if (usrLayout == "horizontal-stack-layout-container") {
    $("#horizontally-stacked-option").attr("checked", "checked");
  } else if (usrLayout == "vertically-stacked-layout-container") {
    $("#vertically-stacked-option").attr("checked", "checked");
  } else if (usrLayout == "mixed-layout-A-container") {
    $("#mixed-layout-A-option").attr("checked", "checked");
  } else if (usrLayout == "mixed-layout-B-container") {
    $("#mixed-layout-B-option").attr("checked", "checked");
  } else if (usrLayout == "tabbed-layout-container") {
    $("#tabbed-layout-option").attr("checked", "checked");
  } else {
    $("#vertically-stacked-option").attr("checked", "checked");
  }
}
function isInteger(str) {
  return /^\d+$/.test(str);
}
//checks for valid number including . (decimal also suppoted)
function isDecimal(str) {
  if (str.trim() == "") {
    return true;
  }
  return /^[0-9]\d*(\.\d+)?$/.test(str);
}
function addLayoutConfiguration(val, accessName, confUrl) {
  var url = "/configuration/ui/update";
  if (typeof confUrl != "undefined") {
    url = confUrl;
  }
  var params = {
    val: val,
    accessname: accessName,
  };
  jQuery.ajax({
    type: "POST",
    url: url,
    data: params,
    dataType: "json",
    success: function (str) {
      //No Message Required
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      // TODO: need to show error message form the Server
    },
  });
}

function popAlert(message) {
  // to display custome alert popup
  $("#alertPopup .alertMessageDiv").text(message);
  $(".pageOverlay").fadeIn("fast");
  $("#alertPopup").fadeIn("fast");
}

function popSuccessMessage(message) {
  // to fade in the success message/ notification in inner pages and fadeout
  $("#innerNotifDiv .successMessageDiv").text(message);
  $("#innerNotifDiv").fadeIn("fast").delay("5000").fadeOut("slow");
}
function hidePagination(divId) {
  if (parseInt($("#" + divId + " span.totalPage").html()) == 1) {
    $("#" + divId + " .pageNumber").hide();
  } else {
    $("#" + divId + " .pageNumber").show();
  }
}

function formatTime(dt) {
  var hours = dt.getHours();
  var minutes = dt.getMinutes();
  var seconds = dt.getSeconds();

  // the above dt.get...() functions return a single digit
  // so I prepend the zero here when needed
  if (hours < 10) hours = "0" + hours;

  if (minutes < 10) minutes = "0" + minutes;

  if (seconds < 10) seconds = "0" + seconds;

  return hours + "." + minutes + "." + seconds;
}

function updateUrl() {
  var firstActiveTabUrl = $(".mainTab.active:visible:first a").attr("href");
  if (firstActiveTabUrl) {
    /*other tab is in focus*/
  } else {
    var firstTabUrl = $(".mainTab:visible:first a").attr("href");
    if (firstTabUrl) {
      $(location).attr("href", firstTabUrl);
    }
    // TODO :check the condition when no tab present
    else {
      $(".recordCategoryListWrapper .tabList li." + "masterDataTab").show();
      $(location).attr("href", "/master-data");
    }
  }
}
function getColumnIndexesById(id) {
  return $("#" + id)
    .map(function () {
      return $(this).index() + 1; // add one because nth-child is not zero based
    })
    .get();
}
