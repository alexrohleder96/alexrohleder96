
/**
 * Minimal Form Interface (orginaly on: tympanus.net/codrops/2014/04/01/minimal-form-interface/)
 *
 * Refactored version of the Codrop's minimal form interface, now simplier, in jQuery and SASS.
 *
 * @author Alex Rohleder <alexrohleder96@outlook.com> <alexrohleder.com.br>
 * @version 1.0
 */
 
$(function () {

    /**
     * Init the minimal form in a form element
     *
     * options
     *    - validate: receive a question input execute some logic
     *                for validating they value and return a boolean.
     *    - error: The callback for making error messages, receives the
     *             question input and returns a string with validation error.
     *    - submit: The callback called when all the inputs are correctly filled.
     */

    $.fn.form = function (options) {

        /**
         * Getting the event end name implemented in the
         * current browser.
         */

        var transEndEventName = ({
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        })[ Modernizr.prefixed('transition') ];


        var form = $(this);
        var current = 0;
        var questions = form.find('.question');
        var question = questions.eq(current).find('input');
        var progress = form.find('.progress-bar');
        var next = form.find('.next');
        var status = form.find('.count .itr');
        var error = form.find('.error');

        /**
         * The default error handler returns the browser
         * default validation message (in english)
         */

        var settings = $.extend({
            validate: function (e) {
                if (Modernizr.formvalidation) {
                       return e[0].checkValidity();
                } else return e.val() !== '';
            },
            error: function (e) {
                if (e[0].validationMessage) {
                       return e[0].validationMessage;
                } else return 'Invalid Input';
            },
            submit: function () {
                // do nothing
            }
        }, options);

        /**
         * When user get in touch with the form, this is the
         * very first event, when user initiate to fill the form.
         */

        var onQuestionFocus = function () {
            // do something ...
        }

        /**
         * on question submit execute question change logic
         * if it is a valid one.
         */

        var onQuestionSubmit = function (ev) {
            ev.preventDefault();

            if (!settings.validate(question)) {
                return !error.html(settings.error(question)).addClass('show');
            }

            current = current + 1;
            progress.css('width', 'p%'.replace('p', current * (100 / questions.length)));
            error.removeClass('show');

            if (current === questions.length) {
                next.off('click');
                return settings.submit(this);
            }

            status.html(current + 1);
            error.html('&nbsp;');
            form.addClass('change');
            questions.eq(current - 1).removeClass('current');
            question = questions.eq(current).addClass('current').find('input').focus();
        }

        /**
         * executed when all the question transition was
         * done.
         */

        var onTransitionEnd = function () {
            form.removeClass('change');
        }

        /**
         * initial dom manipulations.
         * and event binding.
         */

        form.find('.count .total').html(questions.length);
        question.on('focus', onQuestionFocus);
        next.on('click', onQuestionSubmit);
        progress.on(transEndEventName, onTransitionEnd);
    }


    /**
     * ----------------------------------------------------
     * page script.
     * ----------------------------------------------------
     */    

    var foregroundFadeTime = 600;

    /**
     * After all the pages loads, remove the loading
     * indicator.
     */

    $(window).on('load', function () {
        setTimeout(function () {
            $('.foreground').velocity('fadeOut', {'duration': 1000});
            $('.foreground-logotype').remove();
        }, 1000);
    });

    /**
     * For mobile devices, when the navbar is collapsed,
     * create a navigation in the foreground and show it.
     */

    $('.navbar .navbar-toggler').on('click', function () {
        var foreground = $('.foreground');
        if (foreground.empty()) {
            foreground.append(
                $('<ul></ul>').append(
                    $('.navbar ul').html(),
                    $('<a href="#" class="x"><span>&times;</span></a>')
                )
            ).find('a').on('click', function () {
                foreground.velocity('fadeOut', {'duration': foregroundFadeTime});
            });
        }

        foreground.velocity('fadeIn', {'duration': foregroundFadeTime});
    });

    /**
     * Makes all the links for headings to scroll
     * and uses the velocity for this, making more fluid.
     */

    $('.navbar-nav a, a[href^="#"]').on('click', function (ev) {
        ev.preventDefault(), $($(this).attr('href')).velocity('scroll', {'container': $('.content')});
    });

    /**
     * All the logic for the services section on homepage
     * this will make possible a smooth interation with
     * the tab system.
     */

    var service_btns = $('#services .btn');
    var service_tabs_content = $('#services .tab-content');
    var service_tabs_height = 0;
    var service_tabs = service_tabs_content.find('div');
        service_tabs.each(function () {
            service_tabs_height = service_tabs_height > $(this).height() ? service_tabs_height : $(this).height();
        });

    service_tabs_content.height(service_tabs_height);
    service_tabs.not('.active').hide();
    service_btns.on('click', function (ev) {
        var service_btn = $(this);
        var service_tab = $(service_btn.data('tab'));
            service_tabs.velocity('fadeOut', {
                begin: function () {
                    service_btns.removeClass('active');
                    service_btn.addClass('active');
                },
                complete: function () {
                    service_tab.velocity('fadeIn');
                }
            });
    });

    /**
     * The logic responsable for filtering the projects
     * on the portfolio section.
     */

    $('#portfolio .btn').on('click', function (ev) {
        var items = $($(this).data('items'));
        var type  = $(this).data('type');

        if (type !== '*') {
               items.find('.filter-item').addClass('disabled');
               items.find('.filter-item[data-type="%s"]'.replace('%s', type)).removeClass('disabled');
        } else items.find('.filter-item').removeClass('disabled');

        $('#portfolio .btn').removeClass('active');
        $(this).addClass('active');

        ev.stopPropagation();
    });

    /**
     * Initializing the contact form and defining the logic
     * for the submit, here you can define an ajax for example.
     */

    $('#contact form').form({
        submit: function () {

            /**
             * using an example implementation, fully functional
             * you only need an api token from https://mandrilapp.com
             */

            sendEmailWithMandril({
                name   : $('#contact-name').val(),
                email  : $('#contact-email').val(),
                message: $('#contact-message').val()
            });

            $('#contact .d-t > form').velocity('fadeOut', {
                complete: function () {
                    $('#contact .d-t > h1').html('OBRIGADO! LOGO ENTRAREI EM CONTATO :)').velocity('fadeIn');
                }
            });

            /**
             * Don't forget to change the indicated values
             * the email can be writen directly in html.
             */

            function sendEmailWithMandril(data) {
                $.post('https://mandrillapp.com/api/1.0/messages/send.json', {
                    key: 'XdNGXJqZNO9LtpufjHA1IQ',
                    message: {
                        autotext: 'true',
                        subject: data.name + ' got in touch via portfolio',
                        from_email: data.email,
                        html: '<p>' + data.name + ' <b>' + data.email + '</b></p><p>' + data.message + '</p>',
                        to: [{
                            email: 'alexrohleder96@outlook.com',
                            name : 'Alex Rohleder',
                            type : 'to'
                        }]
                    }
                })
            }

        }
    });

});