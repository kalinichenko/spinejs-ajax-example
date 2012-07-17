
$ = jQuery
@MeetSpine ?= {}

class Util
  setMode: (mode) ->
    if $("#content").hasClass("viewing") 
      $("#content").removeClass("viewing")
    if $("#content").hasClass("editing")
      $("#content").removeClass("editing")
    if $("#content").hasClass("listing")
      $("#content").removeClass("listing")
    $("#content").addClass(mode)

Spine.Model.host = "http://192.168.1.188:8080/ibank-ws/rest"

class Payment extends Spine.Model
  @configure "Payment", "Content-Type", "DATE_DOC", "NUM_DOC", "AMOUNT", "CLN_NAME", "CLN_OKPO", "CLN_ACCOUNT", "CLN_BANK_ACCOUNT", "CLN_BANK_MFO", "RCPT_NAME", "RCPT_OKPO", "RCPT_ACCOUNT", "RCPT_BANK_NAME", "RCPT_BANK_MFO", "PAYMENT_DETAILS", "VALUE_DATE", "RCPT_COUNTRY_CODE", "CLN_COUNTRY_CODE"

  @extend Spine.Model.Ajax
  @url: "rest/payments"


#  @fetch: (callbackOrParams) ->
#  	@refresh(docs, clear: true)


# Expose it in the root namespace
MeetSpine.Payment = Payment

class PaymentEdit extends Spine.Controller
  events:
    "click #save": "save"
    "click .editing #close": "close"

  elements:
    "form": "form"

  constructor: ->
    super
    new Util().setMode "editing"
    $("#doc").empty().append($("#editTemplate").tmpl(@item))
    @el = $("#doc div")

  close: ->
    @release()
    new PaymentView(item: @item, el: $("#doc"))

  save: (e) ->
    e.preventDefault()
    @item.fromForm($("form"))
    @item = @item.save()
    @close()


class PaymentView extends Spine.Controller
  events:
    "click #edit": "edit"
    "click #delete": "delete"
    "click .viewing #close": "close"

  constructor: ->
    # вначале el: $("#doc") чтоб замапить ивенты
    super    
    new Util().setMode "viewing"
    $("#doc").empty().append($("#viewTemplate").tmpl(@item))
    # потом меняем чтоб в конце отрелизить
    @el = $("#doc div")    

  close: ->
    @release()
    new Util().setMode "listing"

  edit: ->
    @release()
    new PaymentEdit(item: @item, el: $("#doc"))

  delete: ->
    @item.destroy()
    @close()

class Payments extends Spine.Controller
  events:
    "click td":   "view"

  view: ->
    new Util().setMode "viewing"
    new PaymentView(item: @item, el: $("#doc"))

  constructor: ->
    super
    @item.bind("update",  @render)
    # this's call to remove item from controller's collections
    @item.bind("destroy", @release)
  
  render: =>
    @replace($("#itemTemplate").tmpl(@item))
    @

class PaymentApp extends Spine.Controller

  events:
    "click #add": "create"


  elements:
    "#payments":     "payments"
    "#content":      "content"

  constructor: ->
    super
    Payment.bind("create",  @addOne)
#    Payment.bind "save",  (payment) ->
#      console.log payment + " was saved"

    Payment.bind("refresh", @addAll)
    Payment.bind("ajaxSuccess", @ajaxSuccess);
    Payment.bind("ajaxError", @ajaxError)
    Payment.fetch()

  fetch: ->
    alert("Fetch "+Payment.count())

  edit: (doc) ->
    new PaymentEdit(item: doc)

  ajaxSuccess: (data, text, xhr) ->
    console.debug "ajax get: " + xhr.responseText

  ajaxError: (record, xhr, settings, error) =>
    err = $.parseJSON xhr.responseText
    if err.code == '1'
      @edit(record)
    else 
      s = "ajaxError: " + xhr.status + " message: " + xhr.responseText
      console.error s

  addOne: (payment) =>
    view = new Payments(item: payment)
    @payments.append(view.render().el)

  addAll: =>
    Payment.each(@addOne)

  create: (e) ->
    e.preventDefault()
    new Util().setMode("editing")
    item = new Payment(NUM_DOC: 1)
    item.bind "save",  (payment) ->
      #Payment.update this.id, payment
      #console.log payment + " was saved!!! " + item
      item = payment
    new PaymentEdit(item: item, el: $("#doc"))


$ ->
  new PaymentApp(el: $("body"))
