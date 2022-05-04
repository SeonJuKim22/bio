$(window).on('load', function(){
	jaAllReset();
});



/* 전체 함수 호출 */
function jaAllReset(){
	jsScrollBar();//디자인 스크롤바

	/* 폼요소 */
	//jsChk();라디오, 체크박스
	jsFormFocus();//폼 요소 포커스
	var $form_check=$('select').hasClass('js_select');
	if($form_check==true){
		jsSelect();
	}
}

/* 라디오, 체크박스 
function jsChk(){
	$('.jsChk').each(function(){
		if(!$(this).parent().hasClass('js_checkbox')){
			$(this).wrap('<span class="js_checkbox"></span>');
			$(this).closest('.js_checkbox').append('<span class="checkbox"></span>');
		}
	});
}
*/
/* 셀렉트박스 */
var selectShowLen = 3;//보여줄 옵션 개수
var selectCloseSpd = 100;//셀렉트 닫는 속도
var selectOpenSpd = 200;//셀렉트 여는 속도

function jsSelect(select){
	$('.js_select').each(function(){
		var $option = $(this).find('option');
		var $disabled = $(this).find('option:disabled');
		var onIdx = $(this).find('option:selected').index();
		var selTxt = $(this).find('option:selected').text();

		//초기화
		$(this).closest('.js_selectbox').find('.btn_select, .select_layer, .tabIdx').remove();
		$(this).unwrap('.js_selectbox');

		//태그 감싸기
		$(this).wrap('<div class="js_selectbox"></div>');

		if($(this).hasClass('width_100')){
			$(this).closest('.js_selectbox').addClass('width_100');
		}

		var $selectbox = $(this).closest('.js_selectbox');

		if($(this).parents('div').hasClass('jsTblScroll')){
			/* 스크롤 테이블 영역 안에 있을 경우 */
			$selectbox.addClass('normal');

			//버튼 생성
			$selectbox.append('<span class="btn_select">' + selTxt + '</span>');

			//disabled일 경우 버튼 비활성
			if(this.disabled){
				$selectbox.addClass('disabled');
			}

			//옵션 선택
			$(this).change(function(){
				var vlu = $(this).find('option:selected').text();

				$selectbox.find('.btn_select').text(vlu);
			});
		}else{
			/* 일반적인 경우 */
			$(this).attr('tabindex', '-1');

			//버튼 생성
			$selectbox.append('<button type="button" class="btn_select">' + selTxt + '</button><div class="select_layer"></div>');
			var selTitle = $(this).attr('title');
			if(selTitle){
				$selectbox.find('.btn_select').attr('title', selTitle);
			}

			//disabled일 경우 버튼 비활성
			if(this.disabled){
				$selectbox.addClass('disabled').find('.btn_select').prop('disabled', true);
			}

			//옵션 생성
			$option.each(function(){
				var txt = $(this).text();

				$selectbox.find('.select_layer').append('<button type="button" class="btn_option">' + txt + '</button>');
			});

			//option:disabled
			$disabled.each(function(){
				var idx = $(this).index();

				$selectbox.find('.select_layer .btn_option').eq(idx).addClass('disabled').prop('disabled', true);
			});

			var $btnOption = $selectbox.find('.select_layer .btn_option');

			//옵션 레이어 높이 설정
			var optionHei = $btnOption.outerHeight();
			var maxHei = optionHei * selectShowLen;

			$selectbox.find('.select_layer').css({'max-height':maxHei, 'opacity':'1'});

			//스크롤 생성시 레이어 넓이 설정
			if($btnOption.length > 3){
				$selectbox.find('.select_layer').css('right', '0');
			}

			//셀렉트 박스 전체 높이 출력
			$selectbox.find('.select_layer').each(function(){
				var hei = $(this).outerHeight();

				$(this).attr('data', hei);
			});

			//선택
			$btnOption.eq(onIdx).addClass('active').attr('title', '선택됨');

			var selTop = $btnOption.eq(onIdx).position().top;

			if(maxHei < selTop){
				$selectbox.find('.select_layer').scrollTop(selTop - (optionHei * 2));
			}

			$selectbox.find('.select_layer').hide();

			//탭접근성
			if($selectbox.find('option:last-child').is(':disabled')){
				var lastIdx = $selectbox.find('option:last-child').prevAll('option:enabled').index();
			}else{
				var lastIdx = $selectbox.find('option:last-child').index();
			}

			$selectbox.prepend('<div class="tabIdx tabPrev" tabindex="0"></div>');
			$selectbox.append('<div class="tabIdx tabNext" tabindex="0"></div>');

			$selectbox.find('.tabIdx').focus(function(){
				if($(this).hasClass('tabPrev')){
					$selectbox.find('.select_layer .btn_option').eq(lastIdx).focus();
				}else{
					$selectbox.find('.btn_select').focus();
				}
			});

			//옵션 선택시 옵션
			if(select){
				$('.js_select.choice').closest('.js_selectbox').addClass('open').find('.select_layer').show().slideUp(selectCloseSpd, function(){
					$(this).closest('.js_selectbox').removeClass('open');
					$(this).closest('.js_selectbox').find('.btn_select').focus();
					$('.js_select').removeClass('choice');
				}).parents('.form_box').removeClass('active');
			}

			//셀렉트버튼
			$selectbox.find('.btn_select').off('click');
			$selectbox.find('.btn_select').on('click', function(){
				if($selectbox.hasClass('open')){
					//닫기
					jsSelClose();
				}else{
					//열기
					jsSelClose();

					jsSelScrl();

					$selectbox.parents('.form_box').addClass('active');
					$selectbox.css('z-index', '15').find('.select_layer').slideDown(selectOpenSpd, function(){
						$selectbox.addClass('open').removeAttr('style');
					});
				}
			});

			//옵션 선택
			$btnOption.off('click');
			$btnOption.on('click', function(){
				var idx = $(this).index();

				$(this).closest('.js_selectbox').find('select').addClass('choice');
				$(this).closest('.js_selectbox').find('select option').eq(idx).prop('selected', true);

				jsSelect('select');

				jsSelScrl();
			});
		}
	});

	//다른영역 클릭시 셀렉트박스 닫기
	$(document).on('mouseup', function(e){
		var $select = $('.js_selectbox');

		if(!$select.is(e.target) && $select.has(e.target).length === 0){
			jsSelClose();
		}
	});

	$(document).off('focus', '.js_select');
	$(document).on('focus', '.js_select', function(){
		$(this).closest('.js_selectbox').find('.btn_select').focus();
	});



	$('.js_select2').each(function(){
		var selTxt = $(this).find('option:selected').text();

		$(this).closest('.js_selectbox2').find('.sel_text').remove();
		$(this).unwrap('.js_selectbox2');

		$(this).wrap('<div class="js_selectbox2"></div>');

		$(this).closest('.js_selectbox2').append('<span class="sel_text">' + selTxt + '</span>');

		$(this).off('change');
		$(this).on('change', function(){
			var selOption = $(this).find('option:selected').text();

			$(this).closest('.js_selectbox2').find('.sel_text').text(selOption);
		});
	});
}

/* 스크롤시 셀렉트박스 */
function jsSelScrl(){
	var docHei = $(window).height();
	var winTop = $(window).scrollTop();

	$('.js_selectbox').each(function(){
		var selTop = $(this).offset().top;
		var btnHei = $(this).find('.btn_select').outerHeight() + Number($(this).find('.select_layer').attr('data'));

		if(docHei + winTop < selTop + btnHei){
			$(this).addClass('btm');
		}else{
			$(this).removeClass('btm');
		}
	});
}

/* 셀렉트박스 닫기 */
function jsSelClose(){
	$('.js_selectbox.open').find('.select_layer').slideUp(selectCloseSpd, function(){
		$(this).closest('.js_selectbox').removeClass('open');
	}).parents('.form_box').removeClass('active');
}

/* 폼 요소 포커스 */
function jsFormFocus(){
	var $form = '.form_area.type2 .js_selectbox button, .form_area.type2 input, .form_area.type2 ';
	$(document).off('focus', $form);
	$(document).on('focus', $form, function(){
		$(this).closest('.form_area').addClass('focus');
	});

	$(document).off('blur', $form);
	$(document).on('blur', $form, function(){
		$(this).closest('.form_area').removeClass('focus');
	});
}
/*
	* 디자인 스크롤바

	jsScrollBar();
	jsScrollBar('class명');
	jsScrollBar('class명', function(){
		//콜백영역
	});
*/
function jsScrollBar(el, callback){
	if(el){
		var $el = $('.' + el);
	}else{
		var $el = $('.jsScrollBar');
	}

	$el.each(function(){
		$(this).css('overflow', 'inherit');

		$(this).find('.jsScroll, .copyScroll').remove();

		if($(this).find('.jsScrollBarInner').length == 0){
			var html = $(this).html();
		}else{
			var html = $(this).find('.jsScrollBarInner .paddingBox').html();
		}

		var maxHei = $(this).outerHeight();

		//패딩값
		var pdT = parseInt($(this).css('padding-top'));
		var pdR = parseInt($(this).css('padding-right'));
		var pdB = parseInt($(this).css('padding-bottom'));
		var pdL = parseInt($(this).css('padding-left'));
		if(pdT == 0){
			var pdTop = 0;
		}else{
			var pdTop = pdT;
		}
		if(pdR == 0){
			var pdRt = 0;
		}else{
			var pdRt = pdR;
		}
		if(pdB == 0){
			var pdBtm = 0;
		}else{
			var pdBtm = pdB;
		}
		if(pdL == 0){
			var pdLft = 0;
		}else{
			var pdLft = pdL;
		}

		$(this).html('<div class="jsScrollBarInner" tabindex="0"><div class="paddingBox">' + html + '</div></div>');

		$(this).find('.jsScrollBarInner').css({
			'max-height':maxHei + 'px',
			'margin-top':-pdTop,
			'margin-right':-pdRt,
			'margin-bottom':-pdBtm,
			'margin-left':-pdLft
		});
		
		$(this).find('.jsScrollBarInner .paddingBox').css({
			'padding-top':pdTop,
			'padding-right':pdRt,
			'padding-bottom':pdBtm,
			'padding-left':pdLft
		});

		//스크롤바 생성
		var hei = $(this).outerHeight();
		var sHei = $(this).find('.jsScrollBarInner').prop('scrollHeight');
		var barHei =(hei / sHei) * 100;

		if(hei >= sHei){
			$(this).find('.jsScroll, .copyScroll').remove();
			$(this).find('.jsScrollBarInner').removeAttr('tabindex');
		}else{
			$(this).append('<div class="jsScroll"><button type="button" class="bar" style="height:' + barHei + '%;" tabindex="-1"></button></div>');
			$(this).append('<div class="copyScroll" style="height:' + hei + 'px;"><div style="height:' + sHei + 'px;"></div></div>');
		}

		$(this).find('.jsScrollBarInner').scroll(function(){
			var sTop = $(this).scrollTop();
			if(sTop == 0){
				var barTop = 0;
			}else{
				var barTop = (sTop / sHei) * 100;
			}

			$(this).closest('.jsScrollBar').find('.jsScroll .bar').css({'top':barTop + '%'});
		});

		$(this).css({'opacity':'1'});
	});

	//콜백영역
	if(callback){
		callback(true);
	}

	$(document).off('mouseenter', '.jsScrollBar .copyScroll');
	$(document).on('mouseenter', '.jsScrollBar .copyScroll', function(){
		var sTop = $(this).closest('.jsScrollBar').find('.jsScrollBarInner').scrollTop();

		$(this).scrollTop(sTop);
	});

	$('.jsScrollBar .copyScroll').scroll(function(){
		var sTop = $(this).scrollTop();

		$(this).closest('.jsScrollBar').find('.jsScrollBarInner').scrollTop(sTop);
	});
}





