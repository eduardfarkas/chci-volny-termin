describe('template spec', () => {
    it('Loops through each combination of 3 selects', () => {
        const recurse = (commandsFn, checkFn) => {
            commandsFn().then((terminNalezen, kdy, kde) => {
                if (checkFn(terminNalezen)) {
                    cy.log('**NICE!**')
                    return
                }

                recurse(commandsFn, checkFn)
            })
        }

        const najdiVolnyTermin = () => {
            let terminNalezen = false
            let kdy = ''
            let kde = ''

            cy.on('uncaught:exception', (err, runnable) => {
                // returning false here prevents Cypress from
                // failing the test
                return false
            })

            // Navigate to the website
            cy.visit('https://ujop.cuni.cz/UJOP-371.html?ujopcmsid=8:zkouska-z-ralii-a-cestiny-pro-obcanstvi-cr')
            cy.wait(1000)

            // Get the first select element
            cy.get('#select_misto_zkousky option').each(($el_kde, index) => {
                if(index === 0) return // preskocit prvni option = -- vyberte --
                cy.log("misto zkousky: " + $el_kde.val())
                cy.get('#select_misto_zkousky').select(index)
                cy.wait(3000)

                cy.get('#select_cast_zkousky').select(1)
                cy.wait(3000)

                cy.get('#select_termin option').each(($el_kdy, index) => {
                    if(index === 0) return // preskocit prvni option = -- vyberte --
                    cy.log("termin: " + $el_kdy.val())
                    cy.get('#select_termin').invoke('prop', 'disabled').then((disabled) => {
                        if(!disabled) {
                            cy.get('#select_termin').select(index)
                        } else {
                            //cy.log("termin je disabled")
                            // proste nebudeme vybirat option, jedeme dal
                        }

                    })

                    cy.wait(3000)

                    cy.get('#qxid').then(($value) => {
                        cy.log($value.text())
                        if(parseInt($value.text()) > 0) {
                            terminNalezen = true
                            cy.log("termin nalezen")
                            cy.task('sendEmail', {text: `Termin: ${$el_kdy.val()}, ${$el_kde.val()}`}).then(result => {
                                console.log(result);
                            }).then(()=>{
                                throw new Error('Ukonceni testu, termin nalezen')
                            });
                        } else {
                            cy.log("termin neni volny")
                        }
                    })
                })
            })
            return cy.wrap(terminNalezen, kdy, kde)

        }

        recurse(
            () => najdiVolnyTermin(),
            (terminNalezen) => terminNalezen === true,
        )
    })
})


