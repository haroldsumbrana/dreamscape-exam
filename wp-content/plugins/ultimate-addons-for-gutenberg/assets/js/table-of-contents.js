( function( $ ) {

	var scroll = true
	var scroll_offset = 30
	var scroll_delay = 800
	var scroll_to_top = false
	var scroll_element = null

	UAGBTableOfContents = {

		init: function() {

			$( document ).delegate( ".uagb-toc__list a", "click", UAGBTableOfContents._scroll )
			$( document ).delegate( ".uagb-toc__scroll-top", "click", UAGBTableOfContents._scrollTop )
			$( document ).on( "scroll", UAGBTableOfContents._showHideScroll  )

		},

		_showHideScroll: function( e ) {

			if ( null != scroll_element ) {

				if ( jQuery( window ).scrollTop() > 300 ) {
					if ( scroll_to_top ) {
						scroll_element.addClass( "uagb-toc__show-scroll" )
					} else {
						scroll_element.removeClass( "uagb-toc__show-scroll" )
					}
				} else {
					scroll_element.removeClass( "uagb-toc__show-scroll" )
				}
			}
		},

		/**
		 * Smooth To Top.
		 */
		_scrollTop: function( e ) {

			$( "html, body" ).animate( {
				scrollTop: 0
			}, scroll_delay )
		},

		/**
		 * Smooth Scroll.
		 */
		_scroll: function( e ) {

			if ( this.hash !== "" ) {
				var hash = this.hash

				if ( scroll ) {

					var offset = $( hash ).offset()

					if ( "undefined" != typeof offset ) {

						$( "html, body" ).animate( {
							scrollTop: ( offset.top - scroll_offset )
						}, scroll_delay )
					}
				}

			}
		},

		_parseEntity: function( text ) {

			let charEntity = [ "&amp;", "&gt;", "&lt;", "&quot;", "&#39;" ]

			for ( var k = 0 ; k < charEntity.length; k++ ) {
				text = text.split(charEntity[k]).join("")
			}

			text = text.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")

			return text
		},

		_parse: function( match ) {


			let text = match[0]

			text = text.replace( "<h" + match[2] + ">", "" )
			text = text.replace( "</h" + match[2] + ">", "" )

			let text_without_chars = UAGBTableOfContents._parseEntity( text )

			let link_text = text_without_chars.replace(/  */g,"_")

			return link_text
		},

		/**
		 * Alter the_content.
		 */
		_run: function( attr, id ) {

			let mapping = attr.mapping

			if ( undefined != mapping ) {
				for ( var i = 0; i < mapping.length; i++ ) {

					let text = mapping[i][0]
					text = text.replace( "<h" + mapping[i][2] + ">", "" )
					text = text.replace( "</h" + mapping[i][2] + ">", "" )

					var parser = new DOMParser
					var dom = parser.parseFromString( "<!doctype html><body>" + text, "text/html" )
					var decodedString = dom.body.textContent

					let href_link = UAGBTableOfContents._parse( mapping[i] )
					let heading_selector = $( "h" + mapping[i][2] + ":contains(\"" + decodedString + "\")" )

					heading_selector.html( "<span class='uagb-toc__heading-link' id='" + href_link + "'>" + text + "</span>" )
				}

				scroll = attr.smoothScroll
				scroll_offset = attr.smoothScrollOffset
				scroll_delay = attr.smoothScrollDelay
				scroll_to_top = attr.scrollToTop

				scroll_element = $( ".uagb-toc__scroll-top" )
				if ( 0 == scroll_element.length ) {
					$( "body" ).append( "<div class=\"uagb-toc__scroll-top dashicons dashicons-arrow-up-alt2\"></div>" )
					scroll_element = $( ".uagb-toc__scroll-top" )
				}

				if ( scroll_to_top ) {
					scroll_element.addClass( "uagb-toc__show-scroll" )
				} else {
					scroll_element.removeClass( "uagb-toc__show-scroll" )
				}

				UAGBTableOfContents._showHideScroll()
			}
		},
	}

	$( document ).ready(function() {
		UAGBTableOfContents.init()
	})


} )( jQuery )
