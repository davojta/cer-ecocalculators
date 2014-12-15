var ractive = new Ractive({
                              el: 'water_container',
                              template: '#water',
                              data: {
                                  tab: 1,
                                  tarif_water_min: 1844,
                                  tarif_water_full: 9000,
                                  tarif_heating_min: 90.058,
                                  tarif_heating_full: 300.000,


                                  cold_water_amount: 6,
                                  hot_water_amount: 6,
                                  family_members: 3,


                              },
                              computed:{
                                  'consumption_per_person': function() {
                                      var fullWaterAmount = this.get('cold_water_amount') + this.get('hot_water_amount');
                                      var perPerson = fullWaterAmount / this.get('family_members');
                                      var perDay = perPerson / 30;
                                      var liters = perDay * 1000;
                                      console.log('cold',this.get('cold_water_amount'));
                                      return numeral(liters).format('0.0');
                                  },
                                  'advice_type': function() {
                                      var cons = this.get('consumption_per_person');
                                      if (cons <= 45) return 1;
                                      if (cons > 45 && cons <= 56 ) return 2;
                                      if (cons > 56 && cons <= 67 ) return 3;
                                      if (cons > 67 && cons <= 89 ) return 4;
                                      if (cons > 89 && cons <= 122 ) return 5;
                                      if (cons > 123 && cons <= 133 ) return 6;

                                      if (cons > 133) return 7;
                                  }
                              }


                          });

ractive.on('changeTab', function(e, tabNumber) {
    console.log('tabNumber', tabNumber)
    ractive.set('tab', 1)
})

