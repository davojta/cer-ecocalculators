function CalculatorViewModel() {
    var self = this;

    this.tab = ko.observable(1);

    this.changeTab = function(tab) {
        return function() {
            self.tab(tab);
        }
    }

    this.tarifWaterMin = ko.observable(1844);
    this.tarifWaterMax = ko.observable(9000);
    this.tarifHeatingMin = ko.observable(90058);
    this.tarifHeatingFull = ko.observable(300.00);
    this.mediumHeatingRate = ko.observable(0.073);


    this.coldWaterAmount = ko.observable(6);
    this.hotWaterAmount = ko.observable(6);
    this.familyMembers = ko.observable(3);

    this.consuptionPerPerson = ko.computed(function() {
        var fullWaterAmount = parseInt(this.coldWaterAmount(), 10) + parseInt(this.hotWaterAmount(), 10);
        var perPerson = fullWaterAmount / this.familyMembers();
        var perDay = perPerson / 30;
        var liters = perDay * 1000;

        console.log(fullWaterAmount, perPerson, perDay, liters);

        return numeral(liters).format('0.0');
    }, this);

    this.adviceType = ko.computed(function() {
        var cons = this.consuptionPerPerson();
        var type;
        console.log('consuption', cons);
        if (cons <= 45) return 'too_little';
        if (cons > 45 && cons <= 56 ) type = 'champion';
        if (cons > 56 && cons <= 67 ) type = 'very';
        if (cons > 67 && cons <= 89 ) type = 'able';
        if (cons > 89 && cons <= 122 ) type = 'less_then_medium';
        if (cons > 123 && cons <= 133 ) type = 'consuption';

        if (cons > 133) type = 'too_much';

        console.log('return type', type);
        return type;
    }, this);

    this.yearExpenses = ko.computed(function() {
        var benefitRate = 4.2,
            mediumHeatingRate = 0.073;

        var fullTarifAmount = (self.coldWaterAmount() + self.hotWaterAmount()) - benefitRate * self.familyMembers();

        var waterExpenses = 0;
        if (fullTarifAmount > 0) {
            waterExpenses = fullTarifAmount * self.tarifWaterMax() + benefitRate * self.familyMembers()*self.tarifWaterMin();
        } else {
            waterExpenses = (self.coldWaterAmount() + self.hotWaterAmount())*self.tarifWaterMin()
        }

        var heatingExpenses = self.hotWaterAmount()*self.tarifHeatingMin()*self.mediumHeatingRate();

        var yearExpenses = heatingExpenses*12;

        return yearExpenses;
    });

    this.yearExpensesWithoutSubsidy = ko.computed(function() {
        var waterExpenses = (self.coldWaterAmount() + self.hotWaterAmount())*self.tarifWaterMax();
        var heatingExpenses = self.hotWaterAmount()*self.mediumHeatingRate()*self.tarifHeatingFull();
        return (heatingExpenses + waterExpenses)*12;
    });

    this.yearWaterConsuption = ko.computed(function() {
        return (self.coldWaterAmount() + self.hotWaterAmount()) * 12;
    });

    this.yearCO2Volume = ko.computed(function() {

        return self.hotWaterAmount()*12*1.85*6.86;
    });


    this.economyConsuptionPerPerson = 80;

    this.economyFamilyExpenses = ko.computed(function() {
        return self.economyConsuptionPerPerson * 365 / 1000 * self.familyMembers()*(self.tarifWaterMin() + self.tarifHeatingMin()*0.5*self.mediumHeatingRate());
    });

    this.economyfamilyExpensesWithoutSubsidy = ko.computed(function() {
        return self.economyConsuptionPerPerson * 365 / 1000 * self.familyMembers()*(self.tarifWaterMax() + self.tarifHeatingFull()*0.5*self.mediumHeatingRate());
    });

    this.economyFamilyConsuption = ko.computed(function() {
        return self.economyConsuptionPerPerson*self.familyMembers();
    });

    this.economyFamilyCO2 = ko.computed(function() {
        return self.economyConsuptionPerPerson*self.familyMembers()*0.5*1.85*6.86;
    });
}

ko.bindingHandlers.valueNumber = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
// This will be called when the binding is first applied to an element
// Set up any initial state, event handlers, etc. here

        var observable = valueAccessor,
            properties = allBindingsAccessor();

        var interceptor = ko.computed({
                                          read: function () {
                                              var format = properties.format || '0, 0.0';
                                              return numeral(observable()).format(format);
                                          },
                                          write: function (newValue) {
                                              var number = parseFloat(newValue);
                                              if (number) {
                                                  observable(number);
                                              }
                                          }
                                      });

        if (ko.utils.tagNameLower(element) === 'input') {
            ko.applyBindingsToNode(element, { value: interceptor });
        } else {
            ko.applyBindingsToNode(element, { text: interceptor });
        }
    }
};

ko.applyBindings(new CalculatorViewModel());
