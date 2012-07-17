(function() {
  var $, Payment, PaymentApp, PaymentEdit, PaymentView, Payments, Util,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  if (this.MeetSpine == null) this.MeetSpine = {};

  Util = (function() {

    function Util() {}

    Util.prototype.setMode = function(mode) {
      if ($("#content").hasClass("viewing")) $("#content").removeClass("viewing");
      if ($("#content").hasClass("editing")) $("#content").removeClass("editing");
      if ($("#content").hasClass("listing")) $("#content").removeClass("listing");
      return $("#content").addClass(mode);
    };

    return Util;

  })();

  Spine.Model.host = "http://192.168.1.188:8080/ibank-ws/rest";

  Payment = (function(_super) {

    __extends(Payment, _super);

    function Payment() {
      Payment.__super__.constructor.apply(this, arguments);
    }

    Payment.configure("Payment", "Content-Type", "DATE_DOC", "NUM_DOC", "AMOUNT", "CLN_NAME", "CLN_OKPO", "CLN_ACCOUNT", "CLN_BANK_ACCOUNT", "CLN_BANK_MFO", "RCPT_NAME", "RCPT_OKPO", "RCPT_ACCOUNT", "RCPT_BANK_NAME", "RCPT_BANK_MFO", "PAYMENT_DETAILS", "VALUE_DATE", "RCPT_COUNTRY_CODE", "CLN_COUNTRY_CODE");

    Payment.extend(Spine.Model.Ajax);

    Payment.url = "rest/payments";

    return Payment;

  })(Spine.Model);

  MeetSpine.Payment = Payment;

  PaymentEdit = (function(_super) {

    __extends(PaymentEdit, _super);

    PaymentEdit.prototype.events = {
      "click #save": "save",
      "click .editing #close": "close"
    };

    PaymentEdit.prototype.elements = {
      "form": "form"
    };

    function PaymentEdit() {
      PaymentEdit.__super__.constructor.apply(this, arguments);
      new Util().setMode("editing");
      $("#doc").empty().append($("#editTemplate").tmpl(this.item));
      this.el = $("#doc div");
    }

    PaymentEdit.prototype.close = function() {
      this.release();
      return new PaymentView({
        item: this.item,
        el: $("#doc")
      });
    };

    PaymentEdit.prototype.save = function(e) {
      e.preventDefault();
      this.item.fromForm($("form"));
      this.item = this.item.save();
      return this.close();
    };

    return PaymentEdit;

  })(Spine.Controller);

  PaymentView = (function(_super) {

    __extends(PaymentView, _super);

    PaymentView.prototype.events = {
      "click #edit": "edit",
      "click #delete": "delete",
      "click .viewing #close": "close"
    };

    function PaymentView() {
      PaymentView.__super__.constructor.apply(this, arguments);
      new Util().setMode("viewing");
      $("#doc").empty().append($("#viewTemplate").tmpl(this.item));
      this.el = $("#doc div");
    }

    PaymentView.prototype.close = function() {
      this.release();
      return new Util().setMode("listing");
    };

    PaymentView.prototype.edit = function() {
      this.release();
      return new PaymentEdit({
        item: this.item,
        el: $("#doc")
      });
    };

    PaymentView.prototype["delete"] = function() {
      this.item.destroy();
      return this.close();
    };

    return PaymentView;

  })(Spine.Controller);

  Payments = (function(_super) {

    __extends(Payments, _super);

    Payments.prototype.events = {
      "click td": "view"
    };

    Payments.prototype.view = function() {
      new Util().setMode("viewing");
      return new PaymentView({
        item: this.item,
        el: $("#doc")
      });
    };

    function Payments() {
      this.render = __bind(this.render, this);      Payments.__super__.constructor.apply(this, arguments);
      this.item.bind("update", this.render);
      this.item.bind("destroy", this.release);
    }

    Payments.prototype.render = function() {
      this.replace($("#itemTemplate").tmpl(this.item));
      return this;
    };

    return Payments;

  })(Spine.Controller);

  PaymentApp = (function(_super) {

    __extends(PaymentApp, _super);

    PaymentApp.prototype.events = {
      "click #add": "create"
    };

    PaymentApp.prototype.elements = {
      "#payments": "payments",
      "#content": "content"
    };

    function PaymentApp() {
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);
      this.ajaxError = __bind(this.ajaxError, this);      PaymentApp.__super__.constructor.apply(this, arguments);
      Payment.bind("create", this.addOne);
      Payment.bind("refresh", this.addAll);
      Payment.bind("ajaxSuccess", this.ajaxSuccess);
      Payment.bind("ajaxError", this.ajaxError);
      Payment.fetch();
    }

    PaymentApp.prototype.fetch = function() {
      return alert("Fetch " + Payment.count());
    };

    PaymentApp.prototype.edit = function(doc) {
      return new PaymentEdit({
        item: doc
      });
    };

    PaymentApp.prototype.ajaxSuccess = function(data, text, xhr) {
      return console.debug("ajax get: " + xhr.responseText);
    };

    PaymentApp.prototype.ajaxError = function(record, xhr, settings, error) {
      var err, s;
      err = $.parseJSON(xhr.responseText);
      if (err.code === '1') {
        return this.edit(record);
      } else {
        s = "ajaxError: " + xhr.status + " message: " + xhr.responseText;
        return console.error(s);
      }
    };

    PaymentApp.prototype.addOne = function(payment) {
      var view;
      view = new Payments({
        item: payment
      });
      return this.payments.append(view.render().el);
    };

    PaymentApp.prototype.addAll = function() {
      return Payment.each(this.addOne);
    };

    PaymentApp.prototype.create = function(e) {
      var item;
      e.preventDefault();
      new Util().setMode("editing");
      item = new Payment({
        NUM_DOC: 1
      });
      item.bind("save", function(payment) {
        return item = payment;
      });
      return new PaymentEdit({
        item: item,
        el: $("#doc")
      });
    };

    return PaymentApp;

  })(Spine.Controller);

  $(function() {
    return new PaymentApp({
      el: $("body")
    });
  });

}).call(this);
