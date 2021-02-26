var sub_cat=0;
var base_url = window.location.origin;


$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});


$(document).ready(function(e){
    $('.condinue_string').on('keypress keydown keyup paste',function(e){
		//alert("jkdshkj")
		   		if($(this).val().length > 30 ){
					var words = $(this).val().split(" ");
					
					$.each(words, function(key,val) {
						if(val.length > 31){
							if( e.type == 'keypress' || e.type == 'paste'){
								//alert('dfd');
								e.preventDefault();
									iziToast.error({
									timeout: 3000,
									id: 'error',
									title: 'Error',
									message: 'Without Space Condinues String not Allowed',
									position: 'topRight',
									transitionIn: 'fadeInDown'
								});
								
							}
							
						}
					});
					}
				  });
});

   
    $('.decimal_numbers_only').keypress(function (e) {
        var character = String.fromCharCode(e.keyCode)
        var newValue = this.value + character;
        if (isNaN(newValue) || parseFloat(newValue) * 100 % 1 > 0) {
            e.preventDefault();
            return false;
        }
    });
	
$(document).ready(function(){
$('.max5number_b4_de').keypress(function(e) {
		
  var numbers = this.value.split('.');
  var preDecimal = numbers[0];
  if (preDecimal.length>4)
  {
		e.preventDefault();
			iziToast.error({
			timeout: 3000,
			id: 'error',
			title: 'Error',
			message: 'Maximum 5 Digits Only Allowed',
			position: 'topRight',
			transitionIn: 'fadeInDown'
		});
    
  } 

          
});
});


function bidHistoryFunction(lot_id, symbol)
{
    $('#Bid_History_'+lot_id).modal({
        backdrop: 'static',
        keyboard: false
    });  

    $.ajax({
        type: "POST",
        url: base_url+'/biddinghistory',
        data: { lotid: lot_id},
        dataType: 'JSON',
        beforeSend: function(){
            //$('.preloader').show();
        },
        success: function( msg ) {

            if(msg['status'] == true)
            {
                $('#tbody_'+lot_id).empty();
                var i = 1;
                if(msg['data'].length > 0)
                {
                    var htimeZone = $('#hfTimeZone').val();
                    
                    $.each(msg['data'], function(e, pqlist) {
                        
                        //var myEndDate = new Date(pqlist.pbh_cur_bid_datetime).toLocaleString("en-US", {hour12:false,timeZone: htimeZone});

                        //var biddate = convertServerDatetoMyTimezoneFormattedDate(pqlist.pbh_cur_bid_datetime, htimeZone);
                        
                        //bid_amount = inr(pqlist.pbh_cur_bid);
						bid_amount = Number(pqlist.pbh_cur_bid).toLocaleString('en', {minimumFractionDigits: 2});
                        $('#tbody_'+lot_id).append('<tr> <td> '+ i +' </td> <td> '+ pqlist.pbh_cur_bid_datetime +' </td> <td> '+ symbol +' '+ bid_amount +' </td> </tr>');
                        i++;                        
                    });
                }
                else
                {
                    $('#tbody_'+lot_id).append('<tr> <td colspan=4> No Records Found </td> </tr>');                        
                }
            }
            else
            {

            }
            //$('.preloader').hide();
        }
    });    
}


//auto-bid
function autoBidFunction(lot_id, symbol, event_id)
{
    $('#autobid_lotid').val(lot_id);
    $('#autobid_eventid').val(event_id);
    $('#autobid_currency_id').html('in '+symbol);
    $('#autobid_max_dec').val(1);
    
    $('#autoBidForm').modal({
        backdrop: 'static',
        keyboard: false
      })
      .one('click', '#autobid-model', function(e) {

        var lot_id = $('#autobid_lotid').val();
        var amount = $('#autobid_amount').val();
        var dec = $('#autobid_max_dec').val();
        var event_id = $('#autobid_eventid').val();
          
        if(amount != ""){
            $.ajax({
                type: "POST",
                url: base_url + "/autoBidItem",
                data: {
                    lot_id: lot_id,
                    amount: amount,
                    dec: dec,
                    event_id: event_id
                },      
                dataType: "JSON",
                beforeSend: function(){
                $('.preloader').show();
                },
                success: function(msg) {
                $('.preloader').hide();
                    if(msg['status'] == true)
                    {
                        $('#autoBidForm').modal('hide');
                       
                        iziToast.success({
                            timeout: 2500,
                            id: 'success',
                            title: 'Success',
                            message: 'Auto Bidded Successfully',
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onOpened: function(instance, toast){
                                location.reload();
                            },	
                        });	
                    }
                    else{		
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: msg['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });	
                    }
                }
            })
        }else{
            alert('Enter the amount');
        }
    });  
}

function update_my_time(){

    $.ajax({
        type: "POST",
        url: base_url + "/updatemytime",
        dataType: "JSON",
        beforeSend: function(){
       
        },
        success: function(msg) {
      
            $('#my_current_time').html(msg['serverTime']);
   
            },
            complete: function() {
                // Schedule the next request when the current one's complete
                setTimeout(update_my_time, 1000);
            }                       
        
    })             
} 

function categoryChangeFunction()
{
    $('.cat_other').hide();
	$('.subcat_other').hide();
 
    var categories = $('#pmc_cat_name').val();
	if(categories==45 || categories==65 || categories==64)
		  {
			// alert(";lkjhb");
				$('.cat_other').show();
			
		  }
		else{
			
			$('.cat_other').hide();
		
 
		}
    var cat_type= $("#com_cat_type").val();

        $.ajax({
            type: "POST",
            url: base_url + "/getSubproduct",
            data: {
                cat: categories,
                cat_type:cat_type
            },
            dataType: "JSON",
            beforeSend: function(){
                $('.preloader').show();
                },
            success: function(e) {
                    $('.preloader').hide();
                    $("#pms_subcat_name").empty();
					  $("#pms_subcat_name").append("<option value='0'>-- Choose Your Sub Category --</option>")
                    $.each(e, function(e, t) {
                        $("#pms_subcat_name ").append($("<option></option>").attr("value", t.pms_id).text(t.pms_subcat_name))
                    })
            }
        })        
}

function momentTimezoneDateChange(date, timezone){
    var date = date.clone().tz(timezone).format("YYYY-MM-DD h:mm:ss A");
    return date;
}

function convertServerDatetoMyTimezoneFormattedDate(date, timezone){
    // Parse our locale string to [date, time]
    var date = new Date(date).toLocaleString('en-US',{hour12:false, timeZone: timezone}).split(" ");

    // Now we can access our time at date[1], and monthdayyear @ date[0]
    var time = date[1];
    var mdy = date[0];

    // We then parse  the mdy into parts
    mdy = mdy.split('/');
    var month = parseInt(mdy[0]);
    var day = parseInt(mdy[1]);
    var year = parseInt(mdy[2]);

    // Putting it all together
    var formattedDate = day + '-' + month + '-' + year + ' ' + time;

    return formattedDate;
}

function makeabid(lotId) {

    var enterbid_amount = parseFloat($('#bid_price_'+lotId).val());

//alert('jo');
    if(enterbid_amount > 0)
    {
        if(($('#bid_price_'+lotId).val()).length <= 15) {
            var req_quantity=parseInt($('#req_quantity_'+lotId).val());       
            var currency_symbol=$('#currency_symbol_'+lotId).val();   
            var amount_che =$('#bid_price_'+lotId).val();
            
            var reserve_bid=parseFloat($('#reserve_bid_'+lotId).val());
            var current_bid=parseFloat($('#current_bid_'+lotId).val());
            var max_dec=parseFloat($('#max_dec_'+lotId).val());
            var start_price=parseFloat($('#start_price_'+lotId).val());
                
                var event_type=$('#event_type_'+lotId).val();
                var event_cate=$('#event_category_'+lotId).val();

                if(event_type==2){
                    
                    var first_bid;
                    if(current_bid==0){
                        first_bid=1;
                        current_bid=start_price;
                    }

					var numb = number_test(amount_che);
					if(numb == 0){
						dec_starting_price = start_price.toFixed(2)/Math.pow(10, -2);
						dec_max_diff = max_dec.toFixed(2)/Math.pow(10, -2);
						dec_enterbid = enterbid_amount.toFixed(2)/Math.pow(10, -2);
						
						var calc_bid = dec_starting_price - dec_enterbid;
						var calc_floot_check = calc_bid % dec_max_diff;
					}
					else{
						var calc_floot_check = 0;
					}
					
					// alert(start_price.toFixed(2));
					// alert(dec_starting_price);
					// alert(dec_max_diff);
					// alert(dec_enterbid);
					// alert(calc_bid);
					
					//alert(numb);
					//alert(calc_floot_check);
                    
                    var check_valid_amount=current_bid-enterbid_amount;
					
					//alert(check_valid_amount);
					//alert(max_dec);
						
					if(numb == 0){
						var float_check = 0;
					}else{
						var r_calc_bid = start_price - enterbid_amount;
						var float_check = r_calc_bid % max_dec;
						//var float_check = enterbid_amount % max_dec;
					}
				
					
					if(numb == 0){
						valid = 1;
					}else{
						if(first_bid==1){
							if(check_valid_amount==0){
								valid=1;
							}
							else if(check_valid_amount>=max_dec){
								valid=1;
							}
							else{
								valid=0;
							}
						}else{
							if(check_valid_amount>=max_dec){
								valid=1;
							}
							else{
								valid=0;
							}
						}
					}
					
					//alert(valid);
					 //alert(enterbid_amount);
                    // alert(req_quantity);
                    // alert(currency_symbol);
                    // alert(amount_che);
                     //alert(reserve_bid);
                     //alert(current_bid);
                    // alert(max_dec);
                    // alert(start_price);
					//alert(valid);
					//alert(calc_floot_check);
                    //alert(float_check);
                    
                    var check_valid_amount1=current_bid-enterbid_amount;
                    //var check_valid_amount =check_valid_amount1.toFixed(2) ;    
                    var check_five=max_dec*6;
                    if( check_five <= check_valid_amount1){
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: 'Only 5 times of minimum decrements allowed',
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });
                        return;
                    }

                        
                    if(current_bid>enterbid_amount && enterbid_amount>=reserve_bid && valid==1 && float_check ===0 && calc_floot_check === 0){
						
                    $('.event-full-amount').empty();
                    $("#amnt-text").empty();
                    $(".text-total-value").empty();
					//Number(pqlist.pbh_cur_bid).toLocaleString('en', {minimumFractionDigits: 2});
                    //$('.event-full-amount').html(inr(enterbid_amount));
					$('.event-full-amount').html(Number(enterbid_amount).toLocaleString('en', {minimumFractionDigits: 2}));
                    $('.text-total-value').html('Total Value : '+Number(req_quantity * enterbid_amount).toLocaleString('en', {minimumFractionDigits: 2}));
                    // if(event_cate == 1)
                    // {
                    //     $('.text-total-value').html('Total Value : '+Number(req_quantity * enterbid_amount).toLocaleString('en', {minimumFractionDigits: 2}));
                    // }
                    // else
                    // {
                    //     $('.text-total-value').html('Total Value : '+Number(enterbid_amount).toLocaleString('en', {minimumFractionDigits: 2}));
                    // }
                    $("#amnt-text").html(toWords(enterbid_amount)+' Only')
                    //$("#amnt-text").html('Only')

                    $.ajax({
                        type: "POST",
                        url: base_url + "/validateLotBidItem",
                        data: {
                            lotID: lotId,
                            bid_price: enterbid_amount, 
                        },                
                        dataType: "JSON",
                        beforeSend: function(){
                            $('.preloader').show();
                        },
                        success: function(msg) {
                            $('.preloader').hide();

                            if(msg['status'] == true)
                            {
                                $('#invite_Pricing_Amount').modal({
                                    backdrop: 'static',
                                    keyboard: false
                                });

                                $('#invite_Pricing_Amount #popup_lot').val(lotId);
                                $('#invite_Pricing_Amount #popup_bid').val(enterbid_amount);
                                $('#invite_Pricing_Amount #popup_current_bid').val(current_bid);
                                $('#invite_Pricing_Amount #popup_starting_price').val(start_price);
                                $('#invite_Pricing_Amount #popup_event_type').val(event_type);
                                $('#invite_Pricing_Amount #popup_event_category').val(event_cate);
                                $('#invite_Pricing_Amount #popup_max_diff').val(max_dec);
                                $('#invite_Pricing_Amount #popup_reserve_price').val(reserve_bid);

                                $("#Cancel").click(function(){
                                    $('.bitvalue').val("");
                                    $('#invite_Pricing_Amount').modal('hide');
                                    return;
                                });

                                // $('#invite_Pricing_Amount').modal({
                                //     backdrop: 'static',
                                //     keyboard: false
                                // })
                                // $('#confirm-model').click(function() {      
                                    
                                //     $.ajax({
                                //         type: "POST",
                                //         url: base_url + "/addBidLotItem",
                                //         data: formdate,
                                
                                //         dataType: "JSON",
                                //         beforeSend: function(){
                                //         $('.preloader').show();
                                //         },
                                //         success: function(msg) {
                                //             $('.preloader').hide();
                                //             if(msg['status'] == true)
                                //             {
                                //                 $('#bid_price').val($('#bid_price').val())
                                //                 $('#bid_amount').val($('#bid_price').val())
                                //                 //location.reload();
                                //                 $('#invite_Pricing_Amount').modal('hide');
                                //                 //form.find('input[name="bid_price"]').attr( "readonly", "true" ); 
                                        
                                //                 form.find('input[name="bid_price"]').val(null); 

                                //                 //$(".addattr").hide();
                                //                 //$(".editattr").show();

                                //                 iziToast.success({
                                //                     timeout: 2500,
                                //                     id: 'success',
                                //                     title: 'Success',
                                //                     message: 'Bid Placed Successfully',
                                //                     position: 'topRight',
                                //                     transitionIn: 'fadeInDown'
                                //                 });   
                
                                //                 update_current();
                                //                 //  location.reload();
                                //             }
                                //             else{		
                                //                 //alert(msg['c_code']);
                                //                 // if(msg['c_code'] == 3)
                                //                 // {
                                //                 //     iziToast.error({
                                //                 //         timeout: 2500,
                                //                 //         id: 'error',
                                //                 //         title: 'Error',
                                //                 //         message: 'You already made a bid',
                                //                 //         position: 'topRight',
                                //                 //         transitionIn: 'fadeInDown'
                                //                 //     });	
                                //                 // }
                                //                 // else
                                //                 // {
                                //                 //     //location.reload();
                                //                 // }	
                
                                //                 //  location.reload();
                                //                 // window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
                                //             }
                                //         }
                                //     })
                                // });
                                
                                $('#invite_Pricing_Amount').modal('show');

                                $(".seller-price-enter input").blur(); 
                            }
                            else{		
                                if(msg['c_code'] == 3)
                                {
                                    iziToast.error({
                                        timeout: 2500,
                                        id: 'error',
                                        title: 'Error',
                                        message: 'You already made a bid',
                                        position: 'topRight',
                                        transitionIn: 'fadeInDown'
                                    });

                                }
                                else
                                {
                                    location.reload();
                                }	                           
                            }
                        }
                    });               
                                    
                    }else{
                        if(enterbid_amount<reserve_bid)
                            iziToast.error({
                                timeout: 2500,
                                id: 'error',
                                title: 'Error',
                                message: 'Make bid reserve amount',
                                position: 'topRight',
                                transitionIn: 'fadeInDown'
                            });
                        else if(current_bid<enterbid_amount)
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: 'The given bid amount is high',
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });

                        else if(check_valid_amount<max_dec)
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: 'Kindly enter the multiple of Minimum Decrement value',
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });

                        else if(calc_floot_check !== 0)
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: 'Kindly enter the multiple of  Minimum Decrement value',
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });
						
						else if(float_check !== 0)
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: 'Kindly enter the multiple of  Minimum Decrement value',
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });
                        
                    }
                }else{
                    if(enterbid_amount > 0)
                    {
                        $('.event-full-amount').empty();
                        $("#amnt-text").empty();
                        $(".text-total-value").empty();
                        //$('.event-full-amount').html(inr(enterbid_amount));
						$('.event-full-amount').html(Number(enterbid_amount).toLocaleString('en', {minimumFractionDigits: 2}));
                        $('.text-total-value').html('Total Value : '+Number(req_quantity * enterbid_amount).toLocaleString('en', {minimumFractionDigits: 2}));
                        
                        // if(event_cate == 1)
                        // {
                        //     //$('.text-total-value').html('Total Value : '+inr(req_quantity * enterbid_amount));
						// 	$('.text-total-value').html('Total Value : '+Number(req_quantity * enterbid_amount).toLocaleString('en', {minimumFractionDigits: 2}));
                        // }
                        // else
                        // {
                        //     //$('.text-total-value').html('Total Value : '+inr(enterbid_amount));
						// 	$('.text-total-value').html('Total Value : '+Number(enterbid_amount).toLocaleString('en', {minimumFractionDigits: 2}));
                        // }                   
                        
                        $("#amnt-text").html(toWords(enterbid_amount)+' Only')
                        //$("#amnt-text").html('Only')

                        $('#invite_Pricing_Amount').modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        
                        $('#invite_Pricing_Amount #popup_lot').val(lotId);
                        $('#invite_Pricing_Amount #popup_bid').val(enterbid_amount);
                        $('#invite_Pricing_Amount #popup_current_bid').val(current_bid);
                        $('#invite_Pricing_Amount #popup_event_type').val(event_type);
                        $('#invite_Pricing_Amount #popup_event_category').val(event_cate);
                        $('#invite_Pricing_Amount #popup_starting_price').val(start_price);
                        $('#invite_Pricing_Amount #popup_max_diff').val(max_dec);
                        $('#invite_Pricing_Amount #popup_reserve_price').val(reserve_bid);

                        $("#Cancel").click(function(){
                            $('.bitvalue').val("");
                            $('#invite_Pricing_Amount').modal('hide');
                            return;
                        });
                        
                        $('#invite_Pricing_Amount').modal('show');

                        $(".seller-price-enter input").blur(); 
                    }
                    else
                    {
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: 'Negative values are not allowed to bid',
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });
                    }
                } 
        }else{
            iziToast.error({
                timeout: 2500,
                id: 'error',
                title: 'Error',
                message: '15 digits only allowed to bid',
                position: 'topRight',
                transitionIn: 'fadeInDown',
                onOpened: function(instance, toast){
                    $('#bid_price_'+lotId).val(null);
                    $('#bid_price_'+lotId).focus();
                },
            });
        }
    }  
    else
    {
        iziToast.error({
            timeout: 2500,
            id: 'error',
            title: 'Error',
            message: 'Enter your Bid',
            position: 'topRight',
            transitionIn: 'fadeInDown',
            onOpened: function(instance, toast){
                $('#bid_price_'+lotId).val(null);
                $('#bid_price_'+lotId).focus();
            },
        });
    }          

}


$(document).ready(function(){
    //setTimeout(update_current, 2000);
    //setTimeout(update_closed_current, 2000);
	
    var pageURL = $(location).attr("href");    
    
    setTimeout(update_my_time, 100);
    
    if(pageURL == base_url+'/live-auction')
    {
        setTimeout(update_current, 100);
        setTimeout(update_closed_current, 100);
    }
	
	if(pageURL == base_url+'/seller-upcoming')
    {
        setTimeout(update_upcoming, 10);
    }

    if(pageURL == base_url+'/upcoming-event')
    {
        setTimeout(buyer_upcoming, 10);
    }

    if(pageURL == base_url+'/admin-upcoming-event')
    {
        setTimeout(admin_upcoming, 10);
    }

    if(pageURL == base_url+'/buyer-live-auction')
    {
        setTimeout(update_buyer_current, 2000);
        setTimeout(update_buyer_current_invite_acceptance,2000);   
    }

    if(pageURL == base_url+'/admin-live-auction')
    {
        setTimeout(update_admin_current, 2000);
        setTimeout(update_admin_current_invite_acceptance,2000);   
    }
	
	$('input[name=bid_price]').bind('paste', function () {
        var self = this;
        setTimeout(function () {
            if (!/^\d*(\.\d{1,2})+$/.test($(self).val())) $(self).val('');
        }, 0);
    });
    
   /*  $('.seller-quote-val').keypress(function (e) {
        var character = String.fromCharCode(e.keyCode)
        var newValue = this.value + character;
        if (isNaN(newValue) || parseFloat(newValue) * 100 % 1 > 0) {
            e.preventDefault();
            return false;
        }
    }); */
	
	
    $('input[name="pea_event_reserve_price"]').val(0);
    var pathname = window.location.pathname;
    if(pathname=='/buyer-live-auction')
    //setTimeout(update_buyer_current, 2000);
    //setTimeout(update_buyer_current_invite_acceptance,2000);
    if(pathname=='/live-auction')    
    
    //$('#product_no_text_exte').hide();
    //$('#service_no_text_exte').hide();
    
    $('#event-add-items #currency').change(function()
    {
        var curr= $('#currency option:selected').text();

        $("input[name='prod_st_price']").attr("placeholder", "Reserve Price in "+curr);
        $("input[name='prod_min_decrement']").attr("placeholder", "Min Decrement in "+curr);
        $("input[name='pea_event_reserve_price']").attr("placeholder", "Floor Price in "+curr);
    });

    $('#service-event-add-items #currency').change(function()
    {
        var curr= $('#service-event-add-items #currency option:selected').text();

        $("#service-event-add-items input[name='prod_st_price']").attr("placeholder", "Reserve Price in "+curr);
        $("#service-event-add-items input[name='prod_min_decrement']").attr("placeholder", "Min Decrement in "+curr);
        $("#service-event-add-items input[name='pea_event_reserve_price']").attr("placeholder", "Floor Price in "+curr);
    });

    $("#live-confirm-model").click(function(e){ 

        var lotId = $('#popup_lot').val();
        var enterbid_amount = $('#popup_bid').val();
        var current_bid = $('#popup_current_bid').val();
        var starting_price = $('#popup_starting_price').val();
        var event_type = $('#popup_event_type').val();
        var event_category = $('#popup_event_category').val();
        var max_diff = $('#popup_max_diff').val();
        var reserve_bid = $('#popup_reserve_price').val();
                                
        $.ajax({
            type: "POST",
            url: base_url + "/placebid",
            data: {
                lotID: lotId,
                bid_price: enterbid_amount,
                event_type: event_type,
                event_category: event_category,
                current_bid: current_bid,
                starting_price: starting_price,
                max_diff: max_diff,
                reserve_bid: reserve_bid
            },                            
            dataType: "JSON",
            beforeSend: function(){
            $('.preloader').show();
            },
            success: function(msg) {
            $('.preloader').hide();
                //console.log(msg);

                if(msg['status'] == true)
                {
                    $('#invite_Pricing_Amount').modal('hide');

                    //form.find('input[name="bid_price"]').val(null); 
                    $('#bid_price_'+lotId).val(null);
                    //$('#bid_price_'+lotId).attr( "readonly", "true" ); 
            
                    //$(".addattr").hide();
                    //$(".editattr").show();

                    update_current();
   
                    iziToast.success({
                        timeout: 2500,
                        id: 'success',
                        title: 'Success',
                        message: 'Bid Placed Successfully',                                               
                        position: 'topRight',
                        transitionIn: 'fadeInDown'
                    });	
					// location.reload();	
                }
                else{
                    iziToast.error({
                        timeout: 2500,
                        id: 'error',
                        title: 'Error',
                        message: msg['message'],                                            
                        position: 'topRight',
                        transitionIn: 'fadeInDown'
                    });	
                }
            }
        })
    });
    

   /*  $("input[name='prod_quant']").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
		
			 iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: 'Numbers only allowed',
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
          //  alert('Numbers only allowed1');
            return false;
        }
    });

    $("input[name='pea_event_unit_quantity']").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
            iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: 'Numbers only allowed',
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
            return false;
        }
    });

    $("input[name='prod_st_price']").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
            iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: 'Numbers only allowed',
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
            return false;
        }
    });

    $("input[name='pea_event_start_price']").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
            iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: 'Numbers only allowed',
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
            return false;
        }
    });

    $("input[name='prod_min_decrement']").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
            iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: 'Numbers only allowed',
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
            return false;
        }
    });

    $("input[name='pea_event_max_dec']").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
            iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: 'Numbers only allowed',
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
            return false;
        }
    });
    
    $("input[name='pea_event_reserve_price']").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
           iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: 'Numbers only allowed',
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
            return false;
        }
    });
 */

    // var hfExcelUploadSuccessVal = $('#hfExcelUploadSuccess').val();
    // var hfExcelUploadFailureVal = $('#hfExcelUploadFailure').val();

    // if(hfExcelUploadSuccessVal != null || hfExcelUploadFailureVal != null)
    // {
    //     if(hfExcelUploadFailureVal != null)
    //     {
    //         iziToast.error({
    //             timeout: 3000,
    //             id: 'error',
    //             title: 'Error',
    //             message: hfExcelUploadFailureVal,
    //             position: 'topRight',
    //             transitionIn: 'fadeInDown'
    //         });
    //     }
    //     else if(hfExcelUploadSuccessVal != null)
    //     {
    //         iziToast.success({
    //             timeout: 3000,
    //             id: 'success',
    //             title: 'Success',
    //             message: hfExcelUploadSuccessVal,
    //             position: 'bottomRight',
    //             transitionIn: 'bounceInLeft'
    //         });
    //     }
    // }

	$('.select2').select2();
	$("#buy-new-pack").click(function(){
		$(".new-package-list").hide();
	});
	$("#buy-new-pack").click(function(){ 
		$(".new-package-list").show();
    });
    
    $('.service_market_div').hide();
	//$('#makeEditable').SetEditable({ $addButton: $('#but_add')});

	

	
	$(function() {
  $('.datetimes').daterangepicker({
    timePicker: true,
    startDate: moment().startOf('hour'),
    endDate: moment().startOf('hour').add(32, 'hour'),
    locale: {
      format: 'DD/MM/YYYY hh:mm A'
    }
  });
});

var today = new Date();
var maxtoday = new Date(new Date().getTime()+(7*24*60*60*1000));


$(function() {
	
	$('.reportdate').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  //timePicker: true,
  autoUpdateInput:true,
  startDate: moment().startOf('minute').add(5, 'minute'),
  endDate: moment().startOf('hour').add(32, 'hour'), 
  locale: {
  format:'YYYY-MM-DD',
  }
  }, function(start, end, label) {
  var years = moment().diff(start, 'years');
  });

  $('.reportdate').val('');

  var hfTimeZone = $('#hfTimeZone').val();
  var hfMyCurrentTime = $('#hfmyCurrentTime').val(); 

    var starttodayDate = new Date();
    //var starttodayDate1 = new Date().toLocaleString({timeZone: "America/New_York"});
    //starttodayDate.setMinutes( starttodayDate.getMinutes() + 30 );
    starttodayDate.setMinutes( starttodayDate.getMinutes() + 2 );
    //alert(starttodayDate);    
    //alert(starttodayDate1);

	var itemStartDate = $('#hfItemStartTime1').val();
    var itemEndDate = $('#hfItemEndTime1').val();
	
    var roundDown = moment(hfMyCurrentTime).startOf('hour');
    
    myCountryMaxDate = new Date(new Date(hfMyCurrentTime).getTime()+(7*24*60*60*1000));
	
	if(itemStartDate != null){
		
        if(itemStartDate < hfMyCurrentTime){
			//alert(1);
            $('.datetimes1').daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                minDate: itemStartDate,
                maxDate: myCountryMaxDate,
                timePicker: true,
                timePicker24Hour: true,
                autoUpdateInput:true,
                startDate: itemStartDate,
                endDate: moment(hfMyCurrentTime).startOf('hour').add(32, 'hour'),
                //startDate: moment().startOf('minute').add(30, 'minute'),
                //endDate: moment().startOf('hour').add(32, 'hour'),
                locale: {
                //format:'YYYY-MM-DD hh:mm A',
                format: 'YYYY-MM-DD H:mm:ss'
                }
                }, function(start, end, label) {
                var years = moment().diff(start, 'years');
                });
        }else{
			//alert(2);
            $('.datetimes1').daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                minDate: moment(hfMyCurrentTime).startOf('minute').add(30, 'minute'),
                maxDate: myCountryMaxDate,
                timePicker: true,
                timePicker24Hour: true,
                autoUpdateInput:true,
                startDate: itemStartDate,
                endDate: moment(hfMyCurrentTime).startOf('hour').add(32, 'hour'),
                //startDate: moment().startOf('minute').add(30, 'minute'),
                //endDate: moment().startOf('hour').add(32, 'hour'),
                locale: {
                //format:'YYYY-MM-DD hh:mm A',
                format: 'YYYY-MM-DD H:mm:ss'
                }
                }, function(start, end, label) {
                var years = moment().diff(start, 'years');
                });
        }        
        
    }else{
		//alert(3);
        $('.datetimes1').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            minDate: moment(hfMyCurrentTime).startOf('minute').add(30, 'minute'),
            maxDate: myCountryMaxDate,
            timePicker: true,
            timePicker24Hour: true,
            autoUpdateInput:true,
            startDate: moment(hfMyCurrentTime).startOf('minute').add(30, 'minute'),  
            endDate: moment(hfMyCurrentTime).startOf('hour').add(32, 'hour'),
            //startDate: moment().startOf('minute').add(30, 'minute'),
            //endDate: moment().startOf('hour').add(32, 'hour'),
            locale: {
            //format:'YYYY-MM-DD hh:mm A',
            format: 'YYYY-MM-DD H:mm:ss'
            }
            }, function(start, end, label) {
            var years = moment().diff(start, 'years');
            });
    }
  
    var endtodayDate = new Date();
    //endtodayDate.setMinutes( endtodayDate.getMinutes() + 60 );
	endtodayDate.setMinutes( endtodayDate.getMinutes() + 10 );
	

	if(itemEndDate != null){
        if(itemStartDate < hfMyCurrentTime){
            $('.datetimes2').daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                minDate: itemEndDate,
                maxDate: myCountryMaxDate,
                timePicker: true,
                timePicker24Hour: true,
                autoUpdateInput:true,
                startDate: itemEndDate,
                endDate: moment(hfMyCurrentTime).startOf('hour').add(32, 'hour'),
                locale: {
                //format:'YYYY-MM-DD hh:mm A',
                format: 'YYYY-MM-DD H:mm:ss'
                }
                }, function(start, end, label) {
                var years = moment().diff(start, 'years');
                });
            }else{
                $('.datetimes2').daterangepicker({
                    singleDatePicker: true,
                    showDropdowns: true,
                    minDate: moment(hfMyCurrentTime).startOf('minute').add(40, 'minute'),
                    maxDate: myCountryMaxDate,
                    timePicker: true,
                    timePicker24Hour: true,
                    autoUpdateInput:true,
                    startDate: itemEndDate,
                    endDate: moment(hfMyCurrentTime).startOf('hour').add(32, 'hour'),
                    locale: {
                    //format:'YYYY-MM-DD hh:mm A',
                    format: 'YYYY-MM-DD H:mm:ss'
                    }
                    }, function(start, end, label) {
                    var years = moment().diff(start, 'years');
                    });
            }
            
    }else{
        $('.datetimes2').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            minDate: moment(hfMyCurrentTime).startOf('minute').add(40, 'minute'),
            maxDate: myCountryMaxDate,
            timePicker: true,
            timePicker24Hour: true,
            autoUpdateInput:true,
            startDate: moment(hfMyCurrentTime).startOf('hour').add(24, 'hour'),
            endDate: moment(hfMyCurrentTime).startOf('hour').add(32, 'hour'),
            locale: {
            //format:'YYYY-MM-DD hh:mm A',
            format: 'YYYY-MM-DD H:mm:ss'
            }
            }, function(start, end, label) {
            var years = moment().diff(start, 'years');
            });
    }  
  
  });
  
  $('.datetimes1').on('apply.daterangepicker', function(ev, picker) {
       $('#event-detail-form').valid();
      });
	  
	 $('body').on('click','#event-content', function(){ 
		  $("#event-detail-form").validate().element('#pec_event_end_dt');
	 })
  
  
 $("#new_event").validate({
	 
	rules: {
    // simple rule, converted to {required:true}
    pci_comp_name: {
    required: true
    },
    // compound rule
    pec_event_name: { 
		required: true,
    },
    pec_event_id: {
		required: true,
    },
    pec_event_dt: {
		required: true
    }
    
    },
	
  submitHandler: function(form) {
  
  var formdate=$('#new_event').serializeArray();

 
     //   return false;
          $.ajax({
              type: "POST",
              url: base_url+'/addevent',
              data: formdate,
              dataType: 'JSON',
			  beforeSend: function(){
				  $('.preloader').show();
			  },
              success: function( msg ) {
               console.log(msg);
			   $('.preloader').hide();
               if(msg['status']==true){
                //$("#status").html('<div class="alert alert-success"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Thanks for signing up for Purchase Quick. <br/> Please verify your email address."+'</div>');
				iziToast.success({
					timeout: 3000,
					id: 'success',
					title: 'Success',
					message: 'Your Event Added Successfully',
					position: 'bottomRight',
					transitionIn: 'bounceInLeft',
					onOpened: function(instance, toast){
					},
					onClosed: function(instance, toast, closedBy){
						console.info('closedBy: ' + closedBy);
					}
				});
                }
                else{
                //$("#status").html('<div class="alert alert-danger"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"The email address you have entered is already registered."+'</div>');
				iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: 'Event Creation Failed.',
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
                }
          
          }
          });

  }

});

$("#change_password").validate({

    rules: {
      // simple rule, converted to {required:true}
      old_password: {
        required: true,
      },
      new_password: {
        required: true,
      },
      confirm_password: {
        required: true,
        equalTo: "#new_password"
      }
  
  },
  messages: {
    confirm_password: "Password entries do not match"
},
  
  submitHandler: function(form) {
  
  var formdate=$('#change_password').serializeArray();
  
        // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/changepassword',
              data: formdate,
              dataType: 'JSON',
			  beforeSend: function(){
                    $('.preloader').show();
               },
              success: function( msg ) {				
                $('.preloader').hide();
				  if(msg['status']==true)
				  {
					//$("#status").html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Check your email for password Details."+'</div>');
					iziToast.success({
						timeout: 3000,
						id: 'success',
						title: 'Success',
						message: msg['message'],
						position: 'bottomRight',
						transitionIn: 'bounceInLeft',
						onOpened: function(instance, toast){
              window.location.href	=	base_url; 
						},
						onClosed: function(instance, toast, closedBy){
							console.info('closedBy: ' + closedBy);
						}
					});
				 
				  }
				  else{
					$('.preloader').hide();
					//$("#status").html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Invalid Details."+'</div>');
					iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message:  msg['message'],
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
				  }
			}
          });
  
  }
  
  });


  $("#change_language").validate({

    rules: {
      // simple rule, converted to {required:true}
      pci_language: {
        required: true,
      },
  
  },
 
  submitHandler: function(form) {
  
  var formdate=$('#change_language').serializeArray();
  
        // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/changelanguage',
              data: formdate,
              dataType: 'JSON',
			  beforeSend: function(){
                    $('.preloader').show();
               },
              success: function( msg ) {	
                  //alert('hi');			
                $('.preloader').hide();
				  if(msg['status']==true)
				  {
					//$("#status").html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Check your email for password Details."+'</div>');
					iziToast.success({
						timeout: 3000,
						id: 'success',
						title: 'Success',
						message: msg['message'],
						position: 'bottomRight',
						transitionIn: 'bounceInLeft',
						onOpened: function(instance, toast){
              window.location.href	=	base_url; 
						},
						onClosed: function(instance, toast, closedBy){
							console.info('closedBy: ' + closedBy);
						}
					});
				 
				  }
				  else{
					$('.preloader').hide();
					//$("#status").html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Invalid Details."+'</div>');
					iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message:  msg['message'],
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
				  }
			}
          });
  
  }
  
  });



 $("#package_conformation").validate({
	 
	rules: {
    // simple rule, converted to {required:true}
    pci_comp_name: {
    required: true
    },
    // compound rule
    pci_comp_phone: { 
		required: true,
    },
    pmp_pkg_name: {
		required: true,
    },
    pmp_pkg_amount: {
		required: true
    },
	pmp_pkg_eventcount:{
		required: true
	},
	pmp_pkg_validity:{
		required: true
	},
	pli_comp_id:{
		required: true
	},
	pli_sno:{
		required: true
	}
	
    },
	messages: {
        pli_comp_id: "All fields are required",
        pli_sno: "All fields are required",
    },
	
  submitHandler: function(form) {
  
  var formdate=$('#package_conformation').serializeArray();
  var RequestData = {
    key: '6634852',
    txnid: '123456789544',
    hash: '23XzhtXPBs',
    amount: '100',
    firstname: 'Jaysinh',
    email: 'dummyemail@dummy.com',
    phone: '6111111111',
    productinfo: 'Bag',
    surl : 'https://sucess-url.in',
    furl: 'https://fail-url.in',
  
}

var handler = {

    responseHandler: function(BOLT){
        console.log(BOLT);
      // your payment response Code goes here, BOLT is the response object

    },
    catchException: function(BOLT){
console.log(BOLT);
      // the code you use to handle the integration errors goes here

    }
}
  bolt.launch( RequestData , handler ); 
  alert("fsd");
         return false;
          $.ajax({
				type: "POST",
				url: base_url+'/addevent',
				data: formdate,
				dataType: 'JSON',
				beforeSend: function(){
				  $('.preloader').show();
				},
				success: function( msg ) 
				{
				 $('.preloader').hide();
         
				//console.log(msg['packid']);
          
				if(msg['status'] == true)
				{
					window.location.href	=	base_url+'/payment-status/success/'+msg['url']+'/'+msg['packid'];	
				}
				else{		
				if(msg['packid']==0)				
						window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
					}
				}
          });

  }

});

$('#report-submit').click(function()
{
    var event_name = $('#pec_event_name').val();
    var start_date = $('#pec_event_start_dt').val();
    var end_date = $('#pec_event_end_dt').val();

    if(event_name == "" && start_date == "")
    {
        $("#pec_event_name").prop('required',true);
    }
    else if(event_name == "" && start_date != "" && end_date == "")
    {
        $("#pec_event_end_dt").prop('required',true);
    }

});

$("#event-detail-form").validate({
	rules: {
    // simple rule, converted to {required:true}
    pec_event_name: {
    required: true,
    maxlength: 50
    },
    pec_proxy_profile_id:{
        required:true
    },
    pec_event_category: {
        required: true
    },
    pec_event_type:{
		 required: true,
	    valueNotEquals: "0"
    },
    pec_event_dt: {
		required: true
    },
	pec_event_end_dt:{onfocusout: false, greaterThan: "#pec_event_start_dt" }
	
	
    },
	messages: {
        pec_event_end_dt: "Event End Date Must be greater than start Date",
    },

	
  submitHandler: function(form) {
  
 //var formdate=$('#event-detail-form').serializeArray();
//console.log(formdate);
  var data = new FormData(form);
console.log(data);
 // var file_data = $('#term_upload').prop('files')[0];
  var file_data = $('#term_upload').parents('files')[0];
 data.append('file', file_data);
        // return false;
          $.ajax({
				type: "POST",
				url: base_url+'/createnNewEvent',
				data: data,
			   cache: false,
                contentType: false,
                processData: false,
				  //dataType: 'JSON',
				method: 'POST',
                type: 'POST', // For jQuery < 1.9   
				beforeSend: function(){
				  $('.preloader').show();
				},
				success: function( msg ) 
				{
					$('.preloader').hide();         
					
					if(msg['status'] == true)
					{
						//alert("Event Created Successfully ");
						$('.preloader').show();  
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: 'Event Added Successfully',
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
							
						});
					}
					else if(msg['status'] == false){		
						iziToast.error({
							timeout: 3000,
							id: 'error',
							title: 'Error',
							message: msg['message'],
							position: 'topRight',
							transitionIn: 'fadeInDown'
						});
						 //window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
					}
				}
          });

  }

});

// add item for created event

//excel upload
$("#report-form").validate({
	rules: {
        excel : {
            required: true
        }
    },

  submitHandler: function(form) {  
  
  var data = new FormData(form);

  var file_data = $('#excel').prop('files')[0];

  data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/excelitemupload',
				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',						
                            onOpened: function(instance, toast){
                                $('.preloader').show();
                            },
                            onClosed: function(instance, toast, closedBy){							
                                $('.preloader').hide();
                            }
                        });
					}
                }
          });
  }

});

$("#upload-form-closed").validate({
	rules: {
        excel : {
            required: true
        }
    },

  submitHandler: function(form) {  
  
  var data = new FormData(form);

  var file_data = $('#excel').prop('files')[0];

  data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/excelcloseditemupload',
				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',						
                            onOpened: function(instance, toast){
                                $('.preloader').show();
                            },
                            onClosed: function(instance, toast, closedBy){							
                                $('.preloader').hide();
                            }
                        });
					}
                }
          });
  }

});

$("#upload-service-ra-form").validate({
	rules: {
        excel : {
            required: true
        }
    },

  submitHandler: function(form) {  
  
  var data = new FormData(form);

  var file_data = $('#excel').prop('files')[0];

  data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/excelserviceraitemupload',
				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',						
                            onOpened: function(instance, toast){
                                $('.preloader').show();
                            },
                            onClosed: function(instance, toast, closedBy){							
                                $('.preloader').hide();
                            }
                        });
					}
                }
          });
  }

});

$("#upload-service-cb-form").validate({
	rules: {
        excel : {
            required: true
        }
    },

  submitHandler: function(form) {  
  
  var data = new FormData(form);

  var file_data = $('#excel').prop('files')[0];

  data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/excelservicecbitemupload',
				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',						
                            onOpened: function(instance, toast){
                                $('.preloader').show();
                            },
                            onClosed: function(instance, toast, closedBy){							
                                $('.preloader').hide();
                            }
                        });
					}
                }
          });
  }

});



// add  event creation 
 $.validator.addMethod("valueNotEquals", function(e, t, a) {
    return a !== e
}, "This field is required"),
jQuery.validator.addMethod("greaterThan", 
function(value, element, params) {

    if (!/Invalid|NaN/.test(new Date(value))) {
        return new Date(value) > new Date($(params).val());
    }

    return isNaN(value) && isNaN($(params).val()) 
        || (Number(value) > Number($(params).val())); 
},'Must be greater than {0}.');

    // custom code for lesser than
    // sreene added
    jQuery.validator.addMethod('lesserThan', function(value, element, param) {
        return ( Number(value) < Number($(param).val()));
    }, 'Must be less than end' );    

// add item for created event

// add  event creation 
$.validator.addMethod("valueNotEquals", function(e, t, a) {
    return a !== e
}, "This field is required")


//init set values
$('#no_of_time_extension').val(0);
$('#time_extension').val(3);

$("#event-add-items").validate({
	rules: {
    // simple rule, converted to {required:true}
    prod_market: {
        required: true
    },
    pea_is_rank_based_auction: {
        required:true
    },
	prod_lot_no:{
        required: true
    },
	pro_name: {
        required: true
    },
	country: {
		required: true
	},
	   
    prod_cat: {
    required: true
    },
    currency: {
        required: true
    },
    prod_st_price: {
        required: true,
        maxlength: 15
        },
    prod_sub_cat: {
       
        valueNotEquals: "0"
        },
   
    product_name: {
		required: true
    },
    spec: {
      required: true
      },
      prod_unit: {
        required: true
        },
        prod_quant: {
          required: true,
          valueNotEquals: "0",
          maxlength: 5
          },
          pea_event_reserve_price: {
                required: false,
                lesserThan: "#prod_st_price",
                maxlength: 15
            },
            time_extension: {
                required: true
            },
            no_of_time_extension: {
                required: true,
            },         
            prod_min_decrement: {
              required: true,
              lesserThan: "#prod_st_price",
              maxlength: 15
              },
              location: {
                required: true,
                maxlength: 100
                },
				pec_event_start_dt : {
					required:true
				},
				pec_event_end_dt : {
                    required : true,
                    onfocusout: false, 
                    greaterThan: "#pec_event_start_dt"
                },
                // pea_event_emd_value : {
                //     required : true
                // }
    },

    messages: {
        prod_sub_cat: {
            valueNotEquals: "Please select Sub Category  !"
        },
        pec_event_end_dt: "Event End Date Must be greater than start Date",
        prod_min_decrement: "Mininum Decrement Must be lesser than Reserve Price",
        pea_event_reserve_price: "Floor Price Must be lesser than Reserve Price",
    },
  submitHandler: function(form) {
  
  
  var data = new FormData(form);

  // var file_data = $('#term_upload').prop('files')[0];
var file_data = $('#term_upload').parents('files')[0];

  data.append('file', file_data);
//dd(data);
          $.ajax({
				type: "POST",
				url: base_url+'/addProductEvent',
				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: 'Event Item Added Successfully',
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
							
						});
					}
					else{		
					iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: data['message'],
						position: 'topRight',
						transitionIn: 'fadeInDown',						
						onOpened: function(instance, toast){
							$('.preloader').show();
						},
						onClosed: function(instance, toast, closedBy){							
							$('.preloader').hide();
						}
					});					
					//  location.reload();
					// window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
					}
                },
                error:function(msg)
                {
                    //alert('no');
                    iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: 'Something Went Wrong',
						position: 'topRight',
						transitionIn: 'fadeInDown',						
						onOpened: function(instance, toast){
							$('.preloader').show();
						},
						onClosed: function(instance, toast, closedBy){							
							$('.preloader').hide();
						}
					});	
                }
          });

  }

});

$("#service-event-add-items").validate({
	rules: {
    // simple rule, converted to {required:true}
    prod_market: {
        required: true
    },
	prod_lot_no:{
        required: true
    },
    pea_is_rank_based_auction: {
        required:true
    },
    currency: {
        required: true
    },
	country: {
		required: true
	},
	pro_name: {
        required: true
    },		
				  
    prod_cat: {
        required: true
    },
    prod_st_price: {
        required: true,
        maxlength: 15
        },
    spec: {
      required: true
      },
          pea_event_reserve_price: {
                required: false,
                lesserThan: "#prod_st_price",
                maxlength: 15
            },
            time_extension: {
                required: true
            },
            no_of_time_extension: {
                required: true,
            },         
            prod_min_decrement: {
              required: true,
              lesserThan: "#prod_st_price",
              maxlength: 15
              },
              location: {
                required: true,
                maxlength: 100
                },
				pec_event_start_dt : {
					required:true
				},
				pec_event_end_dt : {
                    required : true,
                    onfocusout: false, 
                    greaterThan: "#pec_event_start_dt"
                },
                // pea_event_emd_value : {
                //     required : true
                // }
    },

    messages: {
        prod_sub_cat: {
            valueNotEquals: "Please select Sub Category  !"
        },
        pec_event_end_dt: "Event End Date Must be greater than start Date",
        prod_min_decrement: "Mininum Decrement Must be lesser than Reserve Price",
        pea_event_reserve_price: "Floor Price Must be lesser than Reserve Price",
    },
  submitHandler: function(form) {
  
  
  var data = new FormData(form);
// var file_data = $('#term_upload').prop('files')[0];
var file_data = $('#term_upload').parents('files')[0];

  data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/addProductEvent',
				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: 'Event Item Added Successfully',
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
							
						});
					}
					else{		
					iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: data['message'],
						position: 'topRight',
						transitionIn: 'fadeInDown',						
						onOpened: function(instance, toast){
							$('.preloader').show();
						},
						onClosed: function(instance, toast, closedBy){							
							$('.preloader').hide();
						}
					});					
					//  location.reload();
					// window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
					}
                }
          });

  }

});

$("#wallet-form").validate({

    rules: {
        // simple rule, converted to {required:true}
        wallet_amount : {
            required: true
        },
        payment_method : {
            required: true
        }

        
        },

});

$("#even-completed").validate({
	rules: {
    // simple rule, converted to {required:true}
    
    },

	
  submitHandler: function(form) {
  
  var formdate=$('#even-completed').serializeArray();

    $('#lot-submit-confirmation').modal({
        backdrop: 'static',
        keyboard: false
    }) 
    .one('click', '#confirm-submit-model', function(e) {

        $.ajax({
            type: "POST",
            url: base_url+'/completedEvent',
            data: formdate,
            dataType: 'JSON',
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function( msg ) 
            {
                $('.preloader').hide();       
                
                if(msg['status'] == true)
                {           
                    window.location.href	=	base_url+'/admin-upcoming-event';
                }
                else{		
                    if(msg['c_code'] == 3)
                    {        
                        $('#lot-submit-confirmation').modal('hide');               
                        $.each(msg['message'], function(e, pqlist) {

                            //$('.edit_highligh_'+pqlist.pea_id+'').css("background", "red");
                            $('.edit_highligh_'+pqlist.pea_id+'').animate({height: "50px", width: "50px", backgroundColor:'#943D20'});
                            
                            $('#lot_start_'+pqlist.pea_id+'').css("background", "red");
                            $('#lot_start_'+pqlist.pea_id+'').css("color", "white");
                        })

                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: 'Some item start date was already expired. Kindly update the start date and submit',
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });		
                    }
                    else
                    {
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: 'Even Completed Failed',
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });			
                    }					
                  //  location.reload();
                    // window.location.href	=	base_url+'/upcoming-event/fail/'+msg['url'];	
                    }
            }
      });

    });         

  }

});

$("#edit-service-form").validate({
	rules: {
    // simple rule, converted to {required:true}

    pmc_market_name: {
        required: true
        },
	   pro_name: {
        required: true
        },
    pmc_cat_name: {
        required: true,
        valueNotEquals: "0"
    },
    pea_currency: {
        required: true
    },
    pea_event_start_price: {
        required: true,
        maxlength: 15
    },
    pea_event_max_dec: {
        required: true,
        maxlength: 15,
        lesserThan: "#edit-service-form #pea_event_start_price",
    },
    pea_event_reserve_price: {
        required: true,
        maxlength: 15,
        lesserThan: "#edit-service-form #pea_event_start_price",
    },
    country: {
        required: true
    },
    pea_event_spec: {
      required: true
      },
      pea_event_start_dt: {
          required: true
      },
      pea_event_end_dt: {
        required: true,
        onfocusout: false, 
        greaterThan: "#edit-service-form #pea_event_start_dt"
      },
    pea_event_location: {
        required: true,
        maxlength: 100
        },
		 pmu_unit_name: {
        required: true
        },
        pea_event_unit_quantity: {
          required: true,
          maxlength: 5
          },			  
	/*  term_upload: {
      required: true
      },  */
    },
    messages: {       
        pea_event_end_dt: "Event End Date Must be greater than start Date",
        pea_event_max_dec: "Mininum Decrement Must be lesser than Reserve Price",
        pea_event_reserve_price: "Floor Price Must be lesser than Reserve Price",
    },
	
  submitHandler: function(form) {
  
 // var formdate=$('#edit-service-form').serializeArray();
var data = new FormData(form);

//var file_data = $('#term_upload').prop('files')[0];
var file_data = $('#term_upload').parents('files')[0];

  data.append('file', file_data);
       
          $.ajax({
				type: "POST",
				url: base_url+'/editProductItem',
				data: data,
				dataType: 'JSON', 
				 cache: false,
                contentType: false,
                processData: false,
				  
				beforeSend: function(){
				  $('.preloader').show();
				},
				success: function( msg ) 
				{
					$('.preloader').show();
					if(msg['status'] == true)
					{
			   
					iziToast.success({
						timeout: 3000,
						id: 'success',
						title: 'Success',
						message: 'Product Updated Successfully',
						position: 'bottomRight',
						transitionIn: 'bounceInLeft',
						onOpened: function(instance, toast){
							location.reload();	
						},
						onClosed: function(instance, toast, closedBy){							
							$('.preloader').hide();
							console.info('closedBy: ' + closedBy);
						}
						
					});
					}
					else{	
						iziToast.error({
						timeout: 2500,
						id: 'error',
						title: 'Error',
						message: msg['message'],
						position: 'topRight',
						transitionIn: 'fadeInDown',
						onOpened: function(instance, toast){
							$('.preloader').show();
						},
						onClosed: function(instance, toast, closedBy){							
							$('.preloader').hide();
						}
					});			
					  //  location.reload();
						// window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
						}
				}
          }); 

  }

});

$("#invite-vendorform").validate({
	rules: {
    // simple rule, converted to {required:true}

    pmc_market_name: {
        required: true
        },
        pea_currency : {
            required: true
        },
		pro_name : {
            required: true
        },				  
        country: {
			required: true
		},				 
    pmc_cat_name: {
        required: true,
        valueNotEquals: "0"
    },
    pea_event_start_price: {
        required: true,
        maxlength: 15
    },
    pms_subcat_name: {
		required: true,
		valueNotEquals: "0"
    },
    pea_event_spec: {
      required: true
      },
	  /*  term_upload: {
      required: true
      },  */
      pmu_unit_name: {
        required: true
        },
        pea_event_unit_quantity: {
          required: true,
          maxlength: 5
          },
          pea_event_max_dec: {
            required: true,
            lesserThan: "#pea_event_start_price",
            maxlength: 15
            },
            pea_event_reserve_price: {
                required: true,
                lesserThan: "#pea_event_start_price",
                maxlength: 15
            },
            pea_event_start_dt : {
                required: true
            },
            pea_event_end_dt : {
                required: true,
                onfocusout: false, 
                greaterThan: "#pea_event_start_dt"
            },
            pea_event_location: {
              required: true,
              maxlength: 100
              },
	
    },
    messages: {
        pea_event_end_dt: "Event End Date Must be greater than start Date",
        pea_event_max_dec: "Mininum Decrement Must be lesser than Reserve Price",
        pea_event_reserve_price: "Floor Price Must be lesser than Reserve Price",
    },

	
  submitHandler: function(form) {
   var data = new FormData(form);

// var file_data = $('#term_upload').prop('files')[0];
var file_data = $('#term_upload').parents('files')[0];

  data.append('file', file_data);
  
          $.ajax({
				type: "POST",
				url: base_url+'/editProductItem',
				data: data,
				dataType: 'JSON',
				 cache: false,
                contentType: false,
                processData: false,
				 
				beforeSend: function(){
				  $('.preloader').show();
				},
				success: function( msg ) 
				{
					$('.preloader').show();
					if(msg['status'] == true)
					{
			   
					iziToast.success({
						timeout: 3000,
						id: 'success',
						title: 'Success',
						message: 'product Updated Successfully',
						position: 'bottomRight',
						transitionIn: 'bounceInLeft',
						onOpened: function(instance, toast){
							location.reload();	
						},
						onClosed: function(instance, toast, closedBy){							
							$('.preloader').hide();
							console.info('closedBy: ' + closedBy);
						}
						
					});
					}
					else{	
						iziToast.error({
						timeout: 2500,
						id: 'error',
						title: 'Error',
						message: msg['message'],
						position: 'topRight',
						transitionIn: 'fadeInDown',
						onOpened: function(instance, toast){
							$('.preloader').show();
						},
						onClosed: function(instance, toast, closedBy){							
							$('.preloader').hide();
						}
					});			
					  //  location.reload();
						// window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
						}
				}
          });

  }

});


    $('.mkt_other').hide();
	$('.cat_other').hide();
	$('.subcat_other').hide();
 $("#prod_market").on("change", function() {
    $('.mkt_other').hide();
	$('.cat_other').hide();
	$('.subcat_other').hide();
    var market = $(this).val();
	
	/* if(market==18){
		
		 $('.mkt_other').show();
		  
	}
	else{
		    $('.mkt_other').hide();
			
	} */
  // console.log(market);
    var cat_type= $("#com_cat_type").val();
    $.ajax({
        type: "POST",
        url: base_url + "/getCategories",
        data: {
            market: market,
            cat_type:cat_type
        },
        dataType: "JSON",
        beforeSend: function(){
            $('.preloader').show();
          },
        success: function(e) {
              $('.preloader').hide();
              $("#prod_cat").empty();
              $("#prod_cat").append("<option value='0'>-- Choose Your Categories --</option>")
              $.each(e, function(e, t) {
              $("#prod_cat ").append($("<option></option>").attr("value", t.pmc_id).text(t.pmc_cat_name))
            })
        }
    })
    $("#prod_sub_cat").empty();
    $("#prod_sub_cat").append("<option value='0'>-- Choose Your Sub Category --</option>")
  })


$("#prod_cat").on("change", function() {
   $('.cat_other').hide();
	$('.subcat_other').hide();
 
  var categories = $(this).val();
  //console.log(categories);
 /*  if(categories==45 || categories==65 || categories==64)
		  {
			 //alert(";lkjhb");
				$('.cat_other').show();
			
		  }
		else{
			
			$('.cat_other').hide();
		
 
		} */
  var cat_type= $("#com_cat_type").val();
  $.ajax({
      type: "POST",
      url: base_url + "/getSubproduct",
      data: {
          cat: categories,
          cat_type:cat_type
      },
      dataType: "JSON",
	  beforeSend: function(){
		  $('.preloader').show();
		},
      success: function(e) {
			$('.preloader').hide();
			$("#prod_sub_cat").empty();
			$("#prod_sub_cat").append("<option value='0'>-- Choose Your Sub Category --</option>")
			$.each(e, function(e, t) {
            $("#prod_sub_cat ").append($("<option></option>").attr("value", t.pms_id).text(t.pms_subcat_name))
          })
      }
  })
})

$(".finalizedBid").on("click", function() {

    var id= $(this).attr('id');
    var sellID=  $(this).attr('data-mail');
    var symbol=  $(this).attr('data-symbol');
  
    $('#accept_popup .event-full-rupee').html(symbol);
    
   var amount=  $(this).attr('bid-amount');
	 $('#accept_popup .event-full-amount').html(Number(amount).toLocaleString('en', {minimumFractionDigits: 2}));
	 $('#accept_popup #amnt-text').html(toWords(amount));
	 
   $('#accept_popup').modal({
        backdrop: 'static',
        keyboard: false
    }) 
.one('click', '#confirm-accept-model', function(e) {	
    $.ajax({
     type: "POST",
     url: base_url + "/finalizedBid",
     data: {
         lotID: id,
         sellerID:sellID
     },
     dataType: "JSON",
	 beforeSend: function(){
		$('.preloader').show();
	},
     success: function(msg) {
       $('.preloader').hide();
        if(msg['status'] == true)
         {
            iziToast.success({
                timeout: 2500,
                id: 'success',
                title: 'Success',
                message: 'Bid Accepted Successfully',
                position: 'bottomRight',
                transitionIn: 'bounceInLeft',
                onOpened: function(instance, toast){
                    location.reload();	
                },                
            }); 
         }
         else{	
			/* iziToast.error({
				timeout: 2500,
				id: 'error',
				title: 'Error',
				message: 'Bid accept failed',
				position: 'topRight',
				transitionIn: 'fadeInDown'
			});	*/	
		   location.reload();
         // window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
         }
     }
 })
 });
 return false;
})



$(".declinedBid").on("click", function() {

    var id= $(this).attr('id');
    var sellID=  $(this).attr('data-mail');
    var amount=  $(this).attr('bid-amount');
    var symbol=  $(this).attr('data-symbol');
  
    $('#reject_popup .event-full-rupee').html(symbol);

    //$('#reject_popup .event-full-amount').html(amount);
	$('#reject_popup .event-full-amount').html(Number(amount).toLocaleString('en', {minimumFractionDigits: 2}));
	 $('#reject_popup #amnt-text').html(toWords(amount));

    $('#reject_popup').modal({
        backdrop: 'static',
        keyboard: false
    }) 
    .one('click', '#confirm-reject-model', function(e) {
        
        $.ajax({
            type: "POST",
            url: base_url + "/rejectBid",
            data: {
                lotID: id,
                sellerID:sellID
            },
            dataType: "JSON",
            beforeSend: function(){
               $('.preloader').show();
           },
            success: function(msg) {
              $('.preloader').hide();
               if(msg['status'] == true)
                {
                    iziToast.success({
                        timeout: 2500,
                        id: 'success',
                        title: 'Success',
                        message: 'Bid Rejected Successfully',
                        position: 'bottomRight',
                        transitionIn: 'bounceInLeft',
                        onOpened: function(instance, toast){
                            location.reload();	
                        },                
                    }); 
                }
                else{	
                   iziToast.error({
                       timeout: 2500,
                       id: 'error',
                       title: 'Error',
                       message: $msg['message'],
                       position: 'topRight',
                       transitionIn: 'fadeInDown'
                   });		
                  //location.reload();
                // window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
                }
            }
        })
    });
   
 return false;
})

$('#confirm-model-reject-cancel').click( function () {
    $('#reject_popup').modal('hide');
});

$('#confirm-model-accept-cancel').click( function () {
    $('#accept_popup').modal('hide');
});

$(".declineAllBid").on("click", function() {

    var lotid=  $(this).attr('data-mail');

    $('#rejectall_popup').modal({
        backdrop: 'static',
        keyboard: false
    }) 
    .one('click', '#confirm-rejectall-model', function(e) {
        
        $.ajax({
            type: "POST",
            url: base_url + "/rejectAllBid",
            data: {
                lotID: lotid
            },
            dataType: "JSON",
            beforeSend: function(){
               $('.preloader').show();
           },
            success: function(msg) {
              $('.preloader').hide();
               if(msg['status'] == true)
                {
                    iziToast.success({
                        timeout: 2500,
                        id: 'success',
                        title: 'Success',
                        message: 'Bid Rejected Successfully',
                        position: 'bottomRight',
                        transitionIn: 'bounceInLeft',
                        onOpened: function(instance, toast){
                            location.reload();	
                        },                
                    }); 
                }
                else{	
                   iziToast.error({
                       timeout: 2500,
                       id: 'error',
                       title: 'Error',
                       message: msg['message'],
                       position: 'topRight',
                       transitionIn: 'fadeInDown'
                   });		
                  //location.reload();
                // window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
                }
            }
        })
    });
   
    

 return false;
})

$('#confirm-model-rejectall-cancel').click( function () {
    $('#rejectall_popup').modal('hide');
});

$('.rescheduleLot').click(function()
{
    var lotID=  $(this).attr('data-mail');
    var eventId=  $(this).attr('data-event');    

    $('#rescheduleForm').modal({
        backdrop: 'static',
        keyboard: false
      })
      .one('click', '#reschedule-model', function(e) {

        var startDate = $('#event_start_dt').val();
        var endDate = $('#event_end_dt').val();
          
        $.ajax({
            type: "POST",
            url: base_url + "/rescheduleLotItem",
            data: {
                startDate: startDate,
                endDate: endDate,
                lotID: lotID,
                eventId: eventId
            },      
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               $('.preloader').hide();
                if(msg['status'] == true)
                {
                    $('#rescheduleForm').modal('hide');
                    location.reload();

                    //update_current();
                }
                else{		
                    iziToast.error({
                        timeout: 2500,
                        id: 'error',
                        title: 'Error',
                        message: msg['message'],
                        position: 'topRight',
                        transitionIn: 'fadeInDown'
                    });	
                    //  location.reload();
                    // window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
                }
            }
        })
      });
});

$('#postpond-model-cancel').click( function () {
    $('#PostpondForm').modal('hide');
});

$('#autobid-model-cancel').click( function () {
    $('#autoBidForm').modal('hide');
});

$('#close-model-cancel').click( function () {
    $('#CloseAuctionForm').modal('hide');
});

$('.closeauction').click(function()
{
    var lotID=  $(this).attr('data-mail');
    var eventId=  $(this).attr('data-event');    
    var pageName=  $(this).attr('data-page');

    $('#CloseAuctionForm #eventID').val(eventId);
    $('#CloseAuctionForm #lotID').val(lotID);
    $('#CloseAuctionForm #pageNAME').val(pageName);

    $('#CloseAuctionForm').modal({
        backdrop: 'static',
        keyboard: false
      });     
});

$('#close-model').click(function(){

    var eventId = $('#CloseAuctionForm #eventID').val();
    var lotID = $('#CloseAuctionForm #lotID').val();
    var pageName = $('#CloseAuctionForm #pageNAME').val();
       
            $.ajax({
                type: "POST",
                url: base_url + "/closeLot",
                data: {                   
                    lotID: lotID,
                    eventId: eventId,
                    pageName: pageName
                },      
                dataType: "JSON",
                beforeSend: function(){
                  $('.preloader').show();
                },
                success: function(msg) {
                   $('.preloader').hide();
                    if(msg['status'] == true)
                    {
                        $('#PostpondForm').modal('hide');
                        //location.reload();
    
                        //update_current();
                        iziToast.success({
                            timeout: 2500,
                            id: 'success',
                            title: 'Success',
                            message: 'Item Closed Successfully',
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onOpened: function(instance, toast){
                                location.reload();
                            },	
                        });	
                    }
                    else{		
                        iziToast.error({
                            timeout: 2500,
                            id: 'error',
                            title: 'Error',
                            message: msg['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });	
                        //  location.reload();
                        // window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
                    }
                }
            })
                
       
});

$('.postpondlot').click(function()
{
    var lotID=  $(this).attr('data-mail');
    var eventId=  $(this).attr('data-event');    
    var pageName=  $(this).attr('data-page');  
    
    $('#PostpondForm #eventID').val(eventId);
    $('#PostpondForm #lotID').val(lotID);
    $('#PostpondForm #pageNAME').val(pageName);
    
    if(pageName == "live"){
        $('#event_start_dt').hide();
        $('label[for="event_start_dt"]').hide();
    }else{
        $('#event_start_dt').show();
        $('label[for="event_start_dt"]').show();
    }

    $('#PostpondForm').modal({
        backdrop: 'static',
        keyboard: false
      });      
});

$('#postpond-model').click(function() {          

    var startDate = $('#event_start_dt').val();
    var endDate = $('#event_end_dt').val();
    var eventId = $('#PostpondForm #eventID').val();
    var lotID = $('#PostpondForm #lotID').val();
    var pageName = $('#PostpondForm #pageNAME').val();
      
    $.ajax({
        type: "POST",
        url: base_url + "/postpondItem",
        data: {
            startDate: startDate,
            endDate: endDate,
            lotID: lotID,
            eventId: eventId,
            pageName: pageName
        },      
        dataType: "JSON",
        beforeSend: function(){
          $('.preloader').show();
        },
        success: function(msg) {
           $('.preloader').hide();
            if(msg['status'] == true)
            {
                $('#PostpondForm').modal('hide');
                //location.reload();

                //update_current();
                iziToast.success({
                    timeout: 2500,
                    id: 'success',
                    title: 'Success',
                    message: 'Item Postponded Successfully',
                    position: 'topRight',
                    transitionIn: 'fadeInDown',
                    onOpened: function(instance, toast){
                        location.reload();
                    },	
                });	
            }
            else{		
                iziToast.error({
                    timeout: 2500,
                    id: 'error',
                    title: 'Error',
                    message: msg['message'],
                    position: 'topRight',
                    transitionIn: 'fadeInDown'
                });	
                //  location.reload();
                // window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
            }
        }
    })
});

$('.generatePO').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var currentBid=  $(this).attr('data-bidid');  

    $('#hfPOLotId').val(lotID);
    $('#hfCurrentBid').val(currentBid);
    
    $('#addressForm').modal({
            backdrop: 'static',
            keyboard: false
          });

    // $('#addressForm').modal({
    //     backdrop: 'static',
    //     keyboard: false
    //   })
    //   .one('click', '#address-model', function(e) {

    //     var radioValue = $("input[name='deliver_address']:checked").val();
    //     if(radioValue){
    //         $.ajax({
    //             type: "POST",
    //             url: base_url + "/purchaseorder",
    //             data: {
    //                 addressId: radioValue,
    //                 lotID: lotID,
    //                 currentBid: currentBid
    //             },      
    //             dataType: "JSON",
    //             beforeSend: function(){
    //               $('.preloader').show();
    //             },
    //             success: function(msg) {
    //                $('.preloader').hide();
    //                 if(msg['status'] == true)
    //                 {
    //                     iziToast.success({
    //                         timeout: 2500,
    //                         id: 'success',
    //                         title: 'Success',
    //                         message: msg['message'],
    //                         position: 'bottomRight',
    //                         transitionIn: 'bounceInLeft',
    //                         onOpened: function(instance, toast){
    //                             location.reload();
    //                       },						
    //                     });
    //                 }
    //                 else{		
    //                     iziToast.error({
    //                         timeout: 2500,
    //                         id: 'error',
    //                         title: 'Error',
    //                         message: msg['message'],
    //                         position: 'topRight',
    //                         transitionIn: 'fadeInDown'
    //                     });	
                            
    //                 }
    //             }
    //         })
    //     }
    //     else
    //     {
    //         alert('Select any one of the address to proceed');
    //     }          
        
    //   });
});

$('.customPO').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var currentBid=  $(this).attr('data-bidid');  

    $('#customPOForm #hfPOLotId').val(lotID);
    $('#customPOForm #hfCurrentBid').val(currentBid);
    
    $('#customPOForm').modal({
            backdrop: 'static',
            keyboard: false
          });

    // $('#addressForm').modal({
    //     backdrop: 'static',
    //     keyboard: false
    //   })
    //   .one('click', '#address-model', function(e) {

    //     var radioValue = $("input[name='deliver_address']:checked").val();
    //     if(radioValue){
    //         $.ajax({
    //             type: "POST",
    //             url: base_url + "/purchaseorder",
    //             data: {
    //                 addressId: radioValue,
    //                 lotID: lotID,
    //                 currentBid: currentBid
    //             },      
    //             dataType: "JSON",
    //             beforeSend: function(){
    //               $('.preloader').show();
    //             },
    //             success: function(msg) {
    //                $('.preloader').hide();
    //                 if(msg['status'] == true)
    //                 {
    //                     iziToast.success({
    //                         timeout: 2500,
    //                         id: 'success',
    //                         title: 'Success',
    //                         message: msg['message'],
    //                         position: 'bottomRight',
    //                         transitionIn: 'bounceInLeft',
    //                         onOpened: function(instance, toast){
    //                             location.reload();
    //                       },						
    //                     });
    //                 }
    //                 else{		
    //                     iziToast.error({
    //                         timeout: 2500,
    //                         id: 'error',
    //                         title: 'Error',
    //                         message: msg['message'],
    //                         position: 'topRight',
    //                         transitionIn: 'fadeInDown'
    //                     });	
                            
    //                 }
    //             }
    //         })
    //     }
    //     else
    //     {
    //         alert('Select any one of the address to proceed');
    //     }          
        
    //   });
});

$("#attach_po_form").validate({
	rules: {
    // simple rule, converted to {required:true}
       
        po_upload: {
            required: true
        }
    },    

  submitHandler: function(form) {  
  
    var data = new FormData(form);

    var file_data = $('#po_upload').prop('files')[0];

    data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/attachpo',				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
                        });		
					}
                }
          });

  }

});

$("#generate_po_form").validate({
	rules: {
    // simple rule, converted to {required:true}
        deliver_address: {
            required: true
        },
        logo_upload: {
            required: true
        },
        deliveryDateOption: {
            required: true
        },
        taxValue: {
            required: true
        }
    },
    messages: {
        prod_sub_cat: {
            valueNotEquals: "Please select the required fields !"
        }
    },

  submitHandler: function(form) {  
  
    var data = new FormData(form);

    var file_data = $('#logo_upload').prop('files')[0];

    data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/purchaseorder',				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
                        });		
					}
                }
          });

  }

});

$('.regeneratePO').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var currentBid=  $(this).attr('data-bidid');  
    var poId=  $(this).attr('data-po-id');  

    $('#regen-PO-Form #hfPOId').val(poId);
    $('#regen-PO-Form #hfPOLotId').val(lotID);
    $('#regen-PO-Form #hfCurrentBid').val(currentBid);
    
    $('#regen-PO-Form').modal({
            backdrop: 'static',
            keyboard: false
          });
});

$('.regenCustomPO').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var currentBid=  $(this).attr('data-bidid');  
    var poId=  $(this).attr('data-po-id');  

    $('#regen-Custom-PO-Form #hfPOId').val(poId);
    $('#regen-Custom-PO-Form #hfPOLotId').val(lotID);
    $('#regen-Custom-PO-Form #hfCurrentBid').val(currentBid);
    
    $('#regen-Custom-PO-Form').modal({
            backdrop: 'static',
            keyboard: false
          });
});

$("#regenerate_custompo_form").validate({
	rules: {
    // simple rule, converted to {required:true}
       
        po_upload: {
            required: true
        }
        
    },
   
  submitHandler: function(form) {  
  
    var data = new FormData(form);

    var file_data = $('#regenerate_custompo_form #po_upload').prop('files')[0];

    data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/regenerate_custom_po',				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
                        });		
					}
                }
          });

  }

});

$("#regenerate_po_form").validate({
	rules: {
    // simple rule, converted to {required:true}
        deliver_address: {
            required: true
        },
        logo_upload: {
            required: true
        },
        deliveryDateOption: {
            required: true
        },
        taxValue: {
            required: true
        }
    },
    messages: {
        prod_sub_cat: {
            valueNotEquals: "Please select the required fields !"
        }
    },

  submitHandler: function(form) {  
  
    var data = new FormData(form);

    var file_data = $('#regenerate_po_form #logo_upload').prop('files')[0];

    data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/regenerate_po',				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
                        });		
					}
                }
          });

  }

});

$('.generateInvoice').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var currentBid=  $(this).attr('data-bidid');  

    $('#hfPOLotId').val(lotID);
    $('#hfCurrentBid').val(currentBid);
    
    $('#invoiceForm').modal({
            backdrop: 'static',
            keyboard: false
          });

});

$('.customInvoice').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var currentBid=  $(this).attr('data-bidid');  

    $('#customInvoiceForm #hfPOLotId').val(lotID);
    $('#customInvoiceForm #hfCurrentBid').val(currentBid);
    
    $('#customInvoiceForm').modal({
            backdrop: 'static',
            keyboard: false
          });

});

$('.regenerateInvoice').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var currentBid=  $(this).attr('data-bidid');  
    var ppiid = $(this).attr('data-ppi-id');  

    $('#reinvoiceForm #hfPOLotId').val(lotID);
    $('#reinvoiceForm #hfCurrentBid').val(currentBid);
    $('#reinvoiceForm #hfPPIBid').val(ppiid);
    
    $('#reinvoiceForm').modal({
            backdrop: 'static',
            keyboard: false
          });

});

$("#custom_invoice_form").validate({
	rules: {
    // simple rule, converted to {required:true}
        // deliver_address: {
        //     required: true
        // },
        invoice_upload: {
            required: true
        },
       
    },

  submitHandler: function(form) {  
  
    var data = new FormData(form);

    var file_data = $('#invoice_upload').prop('files')[0];

    data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/custom_invoice',				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
                        });		
					}
                }
          });

  }

});

$("#generate_invoice_form").validate({
	rules: {
    // simple rule, converted to {required:true}
        deliver_address: {
            required: true
        },
        logo_upload: {
            required: true
        },
       
    },
    messages: {
        prod_sub_cat: {
            valueNotEquals: "Please select the required fields !"
        }
    },

  submitHandler: function(form) {  
  
    var data = new FormData(form);

    var file_data = $('#logo_upload').prop('files')[0];

    data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/generate_invoice',				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
                        });		
					}
                }
          });

  }

});

$("#re_generate_invoice_form").validate({
	rules: {
    // simple rule, converted to {required:true}
        deliver_address: {
            required: true
        },
        logo_upload: {
            required: true
        },
       
    },
    messages: {
        prod_sub_cat: {
            valueNotEquals: "Please select the required fields !"
        }
    },

  submitHandler: function(form) {  
  
    var data = new FormData(form);

    var file_data = $('#reinvoiceForm #logo_upload').prop('files')[0];

    data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/regenerate_invoice',				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
                        });		
					}
                }
          });

  }

});

$("#re_custom_invoice_form").validate({
	rules: {
    // simple rule, converted to {required:true}
        // deliver_address: {
        //     required: true
        // },
        invoice_upload: {
            required: true
        },
       
    },
    messages: {
        prod_sub_cat: {
            valueNotEquals: "Please select the required fields !"
        }
    },

  submitHandler: function(form) {  
  
    var data = new FormData(form);

    var file_data = $('#recustomForm #invoice_upload').prop('files')[0];

    data.append('file', file_data);

          $.ajax({
				type: "POST",
				url: base_url+'/regenerate_custom_invoice',				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
                        });		
					}
                }
          });

  }

});

$('.sendInvoice').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var poId=  $(this).attr('data-po-id');
    var currentBid=  $(this).attr('data-bidid');    

    $.ajax({
        type: "POST",
        url: base_url + "/sendInvoice",
        data: {
            poId: poId,
            lotID: lotID,
            currentBid: currentBid
        },      
        dataType: "JSON",
        beforeSend: function(){
          $('.preloader').show();
        },
        success: function(msg) {
           $('.preloader').hide();
            if(msg['status'] == true)
            {
                iziToast.success({
                    timeout: 2500,
                    id: 'success',
                    title: 'Success',
                    message: msg['message'],
                    position: 'bottomRight',
                    transitionIn: 'bounceInLeft',
                    onOpened: function(instance, toast){
                        location.reload();
                  },						
                });
            }
            else{		
                iziToast.error({
                    timeout: 2500,
                    id: 'error',
                    title: 'Error',
                    message: msg['message'],
                    position: 'topRight',
                    transitionIn: 'fadeInDown'
                });	
                    
            }
        }
    })
});

$('#invoice-cancel-model').click( function () {
    $('#invoiceForm').modal('hide');
});

$('#reinvoice-cancel-model').click( function () {
    $('#reinvoiceForm').modal('hide');
});




$('.sendPO').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var poId=  $(this).attr('data-po-id');
    var currentBid=  $(this).attr('data-bidid');    

    $.ajax({
        type: "POST",
        url: base_url + "/sendPO",
        data: {
            poId: poId,
            lotID: lotID,
            currentBid: currentBid
        },      
        dataType: "JSON",
        beforeSend: function(){
          $('.preloader').show();
        },
        success: function(msg) {
           $('.preloader').hide();
            if(msg['status'] == true)
            {
                iziToast.success({
                    timeout: 2500,
                    id: 'success',
                    title: 'Success',
                    message: msg['message'],
                    position: 'bottomRight',
                    transitionIn: 'bounceInLeft',
                    onOpened: function(instance, toast){
                        location.reload();
                  },						
                });
            }
            else{		
                iziToast.error({
                    timeout: 2500,
                    id: 'error',
                    title: 'Error',
                    message: msg['message'],
                    position: 'topRight',
                    transitionIn: 'fadeInDown'
                });	
                    
            }
        }
    })
});

$('.deletePO').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var poId=  $(this).attr('data-po-id');
    var orderId=  $(this).attr('order-id');
    var currentBid=  $(this).attr('data-bidid');    

    $.ajax({
        type: "POST",
        url: base_url + "/deletePO",
        data: {
            poId: poId,
            lotID: lotID,
            orderId: orderId,
            currentBid: currentBid
        },      
        dataType: "JSON",
        beforeSend: function(){
          $('.preloader').show();
        },
        success: function(msg) {
           $('.preloader').hide();
            if(msg['status'] == true)
            {
                iziToast.success({
                    timeout: 2500,
                    id: 'success',
                    title: 'Success',
                    message: msg['message'],
                    position: 'bottomRight',
                    transitionIn: 'bounceInLeft',
                    onOpened: function(instance, toast){
                        location.reload();
                  },						
                });
            }
            else{		
                iziToast.error({
                    timeout: 2500,
                    id: 'error',
                    title: 'Error',
                    message: msg['message'],
                    position: 'topRight',
                    transitionIn: 'fadeInDown'
                });	
                    
            }
        }
    })
});

$('.deleteInvoice').click(function()
{
    var poId=  $(this).attr('data-po-id');
    var invoiceId=  $(this).attr('invoice-id');

    $.ajax({
        type: "POST",
        url: base_url + "/deleteInvoice",
        data: {
            poId: poId,
            invoiceId: invoiceId
        },      
        dataType: "JSON",
        beforeSend: function(){
          $('.preloader').show();
        },
        success: function(msg) {
           $('.preloader').hide();
            if(msg['status'] == true)
            {
                iziToast.success({
                    timeout: 2500,
                    id: 'success',
                    title: 'Success',
                    message: msg['message'],
                    position: 'bottomRight',
                    transitionIn: 'bounceInLeft',
                    onOpened: function(instance, toast){
                        location.reload();
                  },						
                });
            }
            else{		
                iziToast.error({
                    timeout: 2500,
                    id: 'error',
                    title: 'Error',
                    message: msg['message'],
                    position: 'topRight',
                    transitionIn: 'fadeInDown'
                });	
                    
            }
        }
    })
});

$('#address-cancel-model').click( function () {
    $('#addressForm').modal('hide');
});

$('.acceptPO').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var poId=  $(this).attr('data-po-id');
    var currentBid=  $(this).attr('data-bidid');    

    $.ajax({
        type: "POST",
        url: base_url + "/acceptPO",
        data: {
            poId: poId,
            lotID: lotID,
            currentBid: currentBid
        },      
        dataType: "JSON",
        beforeSend: function(){
          $('.preloader').show();
        },
        success: function(msg) {
           $('.preloader').hide();
            if(msg['status'] == true)
            {
                iziToast.success({
                    timeout: 2500,
                    id: 'success',
                    title: 'Success',
                    message: msg['message'],
                    position: 'bottomRight',
                    transitionIn: 'bounceInLeft',
                    onOpened: function(instance, toast){
                        location.reload();
                  },						
                });
            }
            else{		
                iziToast.error({
                    timeout: 2500,
                    id: 'error',
                    title: 'Error',
                    message: msg['message'],
                    position: 'topRight',
                    transitionIn: 'fadeInDown'
                });	
                    
            }
        }
    })
});

$('.rejectPO').click(function()
{
    var poId=  $(this).attr('data-po-id');  
    var auctionId=  $(this).attr('data-bidid'); 
    
    $('#hfPOId').val(poId);
    $('#hfAuctionId').val(auctionId);

    $('#rejectForm').modal({
        backdrop: 'static',
        keyboard: false
    });
});

$("#reject_form").validate({
	rules: {
    // simple rule, converted to {required:true}
        rejectReason: {
            required: true
        },
    },
    messages: {
        prod_sub_cat: {
            valueNotEquals: "Please select the required fields !"
        }
    },

  submitHandler: function(form) {  
  
    var data = new FormData(form);

          $.ajax({
				type: "POST",
				url: base_url+'/rejectPO',				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
                        });		
					}
                }
          });

  }

});

$('.rejectInvoice').click(function()
{
    var poId=  $(this).attr('data-po-id'); 
    var auctionId=  $(this).attr('data-bidid'); 
    
    $('#hfPOId').val(poId);
    $('#hfAuctionId').val(auctionId);

    $('#invoice-rejectForm').modal({
        backdrop: 'static',
        keyboard: false
    });
});

$("#invoice_reject_form").validate({
	rules: {
    // simple rule, converted to {required:true}
        rejectReason: {
            required: true
        },
    },
    messages: {
        prod_sub_cat: {
            valueNotEquals: "Please select the required fields !"
        }
    },

  submitHandler: function(form) {  
  
    var data = new FormData(form);

          $.ajax({
				type: "POST",
				url: base_url+'/rejectInvoice',				
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
                success: function(data){
					$('.preloader').show();  
                    if(data['status'] == true)
					{            
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: data['message'],
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							
						});
					}
					else{		
                        iziToast.error({
                            timeout: 3000,
                            id: 'error',
                            title: 'Error',
                            message: data['message'],
                            position: 'topRight',
                            transitionIn: 'fadeInDown',
                            onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
                        });		
					}
                }
          });

  }

});

$('.acceptInvoice').click(function()
{
    var lotID=  $(this).attr('data-lot-id');
    var poId=  $(this).attr('data-po-id');
    var currentBid=  $(this).attr('data-bidid');    

    $.ajax({
        type: "POST",
        url: base_url + "/acceptInvoice",
        data: {
            poId: poId,
            lotID: lotID,
            currentBid: currentBid
        },      
        dataType: "JSON",
        beforeSend: function(){
          $('.preloader').show();
        },
        success: function(msg) {
           $('.preloader').hide();
            if(msg['status'] == true)
            {
                iziToast.success({
                    timeout: 2500,
                    id: 'success',
                    title: 'Success',
                    message: msg['message'],
                    position: 'bottomRight',
                    transitionIn: 'bounceInLeft',
                    onOpened: function(instance, toast){
                        location.reload();
                  },						
                });
            }
            else{		
                iziToast.error({
                    timeout: 2500,
                    id: 'error',
                    title: 'Error',
                    message: msg['message'],
                    position: 'topRight',
                    transitionIn: 'fadeInDown'
                });	
                    
            }
        }
    })
});

$('#bulk-upload').click(function()
{
    var eventId=  $(this).attr('data-id');
    var eventType=  $(this).attr('data-event-type');
    var eventCat=  $(this).attr('data-event-category');
    
    if(eventType == 2)
    {
        if(eventCat == 1)
        {
            $('#uploadForm-product-re #hfEventId').val(eventId);

            $('#uploadForm-product-re').modal({
                backdrop: 'static',
                keyboard: false
            })
        }
        else
        {
            $('#uploadForm-service-Reverse #hfEventId').val(eventId);

            $('#uploadForm-service-Reverse').modal({
                backdrop: 'static',
                keyboard: false
            })
        }
    }
    else
    {
        if(eventCat == 1)
        {
            $('#uploadForm-Closed #hfClosedEventId').val(eventId);

            $('#uploadForm-Closed').modal({
                backdrop: 'static',
                keyboard: false
            })
        }
        else
        {
            $('#uploadForm-service-Closed #hfClosedEventId').val(eventId);

            $('#uploadForm-service-Closed').modal({
                backdrop: 'static',
                keyboard: false
            })
        }
    }
});

$('#upload-model-cancel').click( function () {
    $('#uploadForm-product-re').modal('hide');
});

$('#service-ra-cancel').click( function () {
    $('#uploadForm-service-Reverse').modal('hide');
});

$('#service-closed-cancel').click( function () {
    $('#uploadForm-service-Closed').modal('hide');
});


$('#upload-closed-model-cancel').click( function () {
    $('#uploadForm-Closed').modal('hide');
});

$('#reschedule-model-cancel').click( function () {
    $('#rescheduleForm').modal('hide');
});

$('.seller-price-enter').each( function(){
    var form = $(this);

 form.validate({
	rules: {
    // simple rule, converted to {required:true}
    bid_price: {
    required: true,
	maxlength: 15,
    minlength: 1
   /* max: function () {
    
        return parseInt($('#bid_amount').val());
    }*/
 
    },
   
},
messages: {
    bid_amount: {
                max: "Please enter less than "+$('#bid_amount').val()
    }
},

	
submitHandler: function(form) {

              // return false;
     
      
        }
      
      })
    });


$(".pq_seller_accept").on("click", function() {
/* if ($(this).hasClass("disabled")) {
        event.preventDefault();
    } */
   var id= $(this).attr('id');
   var invite_type= $(this).attr('data-type');
   //var chkbox= $(this).attr('data-chkbox');
  /*  var isReadOnly = $(this).attr("readonly") === undefined ? false : true;
alert("sdjhfhjjjjjjjjjjjjjjjj");
   if (!$.trim(chkbox)){   
			alert("dhskdk");
		}
		else{   
			alert("not set");
		} */
		/* if(invite_type==2){
 $('#event-reject-confirmation').modal({
        backdrop: 'static',
        keyboard: false
    })
	} */
   $.ajax({
    type: "POST",
    url: base_url + "/inviteAccept",
    data: {
        inviteID: id,
        invite_type: invite_type
    },
    dataType: "JSON",
	beforeSend: function(){
        $('.preloader').show();
        if(invite_type == 1)
        {
            iziToast.info({
                timeout: 3000,
                id: 'info',
                title: 'Info',
                message: 'Accepting the invitation. Kindly dont refresh the page.',
                position: 'bottomRight',
                transitionIn: 'bounceInLeft',            
            });
        }
        else
        {
            iziToast.info({
                timeout: 3000,
                id: 'info',
                title: 'Info',
                message: 'Rejecting the invitation. Kindly dont refresh the page.',
                position: 'bottomRight',
                transitionIn: 'bounceInLeft',            
            });
        }
	  },
    success: function(msg) {
		$('.preloader').hide();
        if(msg['status'] == true)
        {
            //location.reload();
            if(invite_type == 1)
            {
                iziToast.success({
                    timeout: 2500,
                    id: 'success',
                    title: 'Success',
                    message: 'Invitation accepted successfully',
                    position: 'topRight',
                    transitionIn: 'fadeInDown',
                    onOpened: function(instance, toast){
                        location.reload();	
                    },
                });     
            }
            else
            {
                iziToast.success({
                    timeout: 2500,
                    id: 'success',
                    title: 'Success',
                    message: 'Invitation rejected successfully',
                    position: 'topRight',
                    transitionIn: 'fadeInDown',
                    onOpened: function(instance, toast){
                        location.reload();	
                    },
                });     
            }
        }
        else{		
            //alert("product add failed ");	
            
            iziToast.error({
                timeout: 2500,
                id: 'error',
                title: 'Error',
                message: msg['message'],
                position: 'topRight',
                transitionIn: 'fadeInDown'
            });	

            location.reload();
            // window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
        }
    }
})

})

    $('.mkt_other').hide();
	$('.cat_other').hide();
	$('.subcat_other').hide();
$("#pmc_market_name").on("change", function() {
    $('.mkt_other').hide();
	$('.cat_other').hide();
	$('.subcat_other').hide();
 
    var market = $(this).val();
	if(market==18){
		
		 $('.mkt_other').show();
		  
	}
	else{
		    $('.mkt_other').hide();
			
	}
    var cat_type= $("#com_cat_type").val();
    $.ajax({
        type: "POST",
        url: base_url + "/getCategories",
        data: {
            market: market,
            cat_type:cat_type
        },
        dataType: "JSON",
		beforeSend: function(){
			$('.preloader').show();
		},
	
        success: function(e) {
			$('.preloader').hide();
           $("#pmc_cat_name").empty();
           $("#pmc_cat_name").append("<option value='0'>-- Choose Your Categories --</option>")
             $.each(e, function(e, t) {
             
                $("#pmc_cat_name").append($("<option></option>").attr("value", t.pmc_id).text(t.pmc_cat_name))
            })

            $("#pmc_cat_name option[value="+cat+"]").prop("selected",true);
        }
    })
    $("#pms_subcat_name").empty();
    $("#pms_subcat_name").append("<option value=''>-- Choose Your Sub Categories --</option>")
  })

  $('#delete-cancel').click( function () {
    $('#lot-delete-confirmation').modal('hide');       

});

$('#confirm-submit-cancel').click( function () {
    $('#lot-submit-confirmation').modal('hide');       

});

  $('.removeItem').on("click", function() {
    var itemID = $(this).attr('data-trash-id');

    $('#hfDeleteLotId').val(itemID);

    $('#lot-delete-confirmation').modal({
        backdrop: 'static',
        keyboard: false
    })
    .one('click', '#delete-confirm-model', function(e) {        
        $.ajax({
                type: "POST",
                url: base_url + "/deleteProuct",
                data: {
                    pmc_id: itemID
                },
                dataType: "JSON",
            	beforeSend: function(){
            		$('.preloader').show();
            	},
                success: function(e) {
                    $('.preloader').hide();
                    
                    iziToast.success({
                        timeout: 2500,
                        id: 'success',
                        title: 'Success',
                        message: 'Item Deleted Successfully',
                        position: 'topRight',
                        transitionIn: 'fadeInDown',
                        onOpened: function(instance, toast){
                            location.reload();	
                        },
                    });                       
                }
            })
    });

    // $.ajax({
    //     type: "POST",
    //     url: base_url + "/deleteProuct",
    //     data: {
    //         pmc_id: itemID
    //     },
    //     dataType: "JSON",
	// 	beforeSend: function(){
	// 		$('.preloader').show();
	// 	},
    //     success: function(e) {
	// 		$('.preloader').hide();
    //         location.reload();
            
    //     }
    // })
  });

	"use strict";

function IterarCamposEdit(t, n) {
    function i(t) {
        if (null == colsEdi) return !0;
        for (var n = 0; n < colsEdi.length; n++)
            if (t == colsEdi[n]) return !0;
        return !1
    }
    var o = 0;
    t.each(function() {
        o++, "buttons" != $(this).attr("name") && i(o - 1) && n($(this))
    })
}

function FijModoNormal(t) {
    $(t).parent().find("#bAcep").hide(), $(t).parent().find("#bCanc").hide(), $(t).parent().find("#bEdit").show(), $(t).parent().find("#bElim").show(), $(t).parents("tr").attr("id", "")
}

function FijModoEdit(t) {


    $(t).parent().find("#bAcep").show(), $(t).parent().find("#bCanc").show(), $(t).parent().find("#bEdit").hide(), $(t).parent().find("#bElim").hide(), $(t).parents("tr").attr("id", "editing")
}

function ModoEdicion(t) {
    return "editing" == t.attr("id")
}

function rowAcep(t) {
    
    var n = $(t).parents("tr"),
        i = n.find("td");
    ModoEdicion(n) && (IterarCamposEdit(i, function(t) {
        var n = t.find("input").val();
        t.html(n)
    }), FijModoNormal(t), params.onEdit(n))
}

function rowCancel(t) {
    var n = $(t).parents("tr"),
        i = n.find("td");
    ModoEdicion(n) && (IterarCamposEdit(i, function(t) {
        var n = t.find("div").html();
        t.html(n)
    }), FijModoNormal(t))
}

function rowEdit(t) {
    var n = $(t).parents("tr"),
        i = n.find("td");
    ModoEdicion(n) || (IterarCamposEdit(i, function(t) {
        var n = t.html(),
            i = '<div style="display: none;">' + n + "</div>",
            o = '<input class="form-control input-sm" value="' + n + '">';
        t.html(i + o)
    }), FijModoEdit(t))
}

   
    $('#confirm-model-cancel').click( function () {
        $('#invite_Pricing_Amount').modal('hide');       

    });

    $('#invoice-cancel-model').click( function () {
        $('#invoice-rejectForm').modal('hide');
    });

    $('#confirm-model-wallet-cancel').click(function(){
        $('#wallet_popup').modal('hide');
    });

    $('.editattr').click( function () {
        
    $('.seller-quote-val').removeAttr("readonly");
    $(".editattr").hide();
    $(".addattr").show();
    }); 
function rowElim(t) {
    
    $(t).parents("tr").remove(), params.onDelete()
}

function rowAgreg() {
    if (0 == $tab_en_edic.find("tbody tr").length) {
        var t = "";
        (i = $tab_en_edic.find("thead tr").find("th")).each(function() {
            "buttons" == $(this).attr("name") ? t += colEdicHtml : t += "<td></td>"
        }), $tab_en_edic.find("tbody").append("<tr>" + t + "</tr>")
    } else {
        var n = $tab_en_edic.find("tr:last");
        n.clone().appendTo(n.parent());
        var i = (n = $tab_en_edic.find("tr:last")).find("td");
        i.each(function() {
            "buttons" == $(this).attr("name") || $(this).html("")
        })
    }
}

function TableToCSV(t) {
    var n = "",
        i = "";
    return $tab_en_edic.find("tbody tr").each(function() {
        ModoEdicion($(this)) && $(this).find("#bAcep").click();
        var o = $(this).find("td");
        n = "", o.each(function() {
            "buttons" == $(this).attr("name") || (n = n + $(this).html() + t)
        }), "" != n && (n = n.substr(0, n.length - t.length)), i = i + n + "\n"
    }), i
}
var $tab_en_edic = null,
    params = null,
    colsEdi = null,
    newColHtml = '<div class="btn-group table-action-btn"><button id="bEdit" type="button" class="btn btn-sm btn-edit-row" onclick="rowEdit(this);"><span class="fa fa-pencil" > </span></button><button id="bElim" type="button" class="btn btn-sm btn-delete-row" onclick="rowElim(this);"><span class="fa fa-trash" > </span></button><button id="bAcep" type="button" class="btn btn-sm btn-save-row" style="display:none;" onclick="rowAcep(this);"><span class="fa fa-check"> </span></button><button id="bCanc" type="button" class="btn btn-sm btn-remove-row" style="display:none;" onclick="rowCancel(this);"><span class="fa fa-times" > </span></button><button type="button" class="btn btn-sm btn-invite-row dropdown"><a href="javascript:" class="dropbtn"><span class="fa fa-envelope"></span></a><div class="dropdown-content"><a href="#" title="Own Vendor" data-toggle="modal" data-target="#invite_ownvendor">Own Vendor</a><a href="#" title="PQ Vendor" data-toggle="modal" data-target="#invite_PQvendor">PQ Vendor</a></div></button></div>',
    colEdicHtml = '<td name="buttons">' + newColHtml + "</td>";

});
function inr(rupee){var x=rupee;x=x.toString();var afterPoint='';if(x.indexOf('.')>0)
			afterPoint=x.substring(x.indexOf('.'),x.length);x=Math.floor(x);x=x.toString();var lastThree=x.substring(x.length-3);var otherNumbers=x.substring(0,x.length-3);if(otherNumbers!='')
			lastThree=','+lastThree;var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,",")+lastThree+afterPoint;return res}
           
           
            function convertNumberToWords(amount) {
                var words = new Array();
                words[0] = '';
                words[1] = 'One';
                words[2] = 'Two';
                words[3] = 'Three';
                words[4] = 'Four';
                words[5] = 'Five';
                words[6] = 'Six';
                words[7] = 'Seven';
                words[8] = 'Eight';
                words[9] = 'Nine';
                words[10] = 'Ten';
                words[11] = 'Eleven';
                words[12] = 'Twelve';
                words[13] = 'Thirteen';
                words[14] = 'Fourteen';
                words[15] = 'Fifteen';
                words[16] = 'Sixteen';
                words[17] = 'Seventeen';
                words[18] = 'Eighteen';
                words[19] = 'Nineteen';
                words[20] = 'Twenty';
                words[30] = 'Thirty';
                words[40] = 'Forty';
                words[50] = 'Fifty';
                words[60] = 'Sixty';
                words[70] = 'Seventy';
                words[80] = 'Eighty';
                words[90] = 'Ninety';
                amount = amount.toString();
                var atemp = amount.split(".");
                var number = atemp[0].split(",").join("");
                var n_length = number.length;
                var words_string = "";
                if (n_length <= 9) {
                    var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
                    var received_n_array = new Array();
                    for (var i = 0; i < n_length; i++) {
                        received_n_array[i] = number.substr(i, 1);
                    }
                    for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                        n_array[i] = received_n_array[j];
                    }
                    for (var i = 0, j = 1; i < 9; i++, j++) {
                        if (i == 0 || i == 2 || i == 4 || i == 7) {
                            if (n_array[i] == 1) {
                                n_array[j] = 10 + parseInt(n_array[j]);
                                n_array[i] = 0;
                            }
                        }
                    }
                    value = "";
                    for (var i = 0; i < 9; i++) {
                        if (i == 0 || i == 2 || i == 4 || i == 7) {
                            value = n_array[i] * 10;
                        } else {
                            value = n_array[i];
                        }
                        if (value != 0) {
                            words_string += words[value] + " ";
                        }
                        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                            words_string += "Crores ";
                        }
                        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                            words_string += "Lakhs ";
                        }
                        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                            words_string += "Thousand ";
                        }
                        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                            words_string += "Hundred and ";
                        } else if (i == 6 && value != 0) {
                            words_string += "Hundred ";
                        }
                    }
                    words_string = words_string.split("  ").join(" ");
                }
                return words_string;
            }	

			var th = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

            var dg = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            var tn = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            var tw = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            
            function toWords(s) {
                s = s.toString();
                s = s.replace(/[\, ]/g, '');
                if (s != parseFloat(s))
                    return 'not a number';
                var x = s.indexOf('.');
                if (x == -1)
                    x = s.length;
                if (x > 15)
                    return 'too big';
                var n = s.split('');
                var str = '';
                var sk = 0;
                for (var i = 0; i < x; i++) {
                    if ((x - i) % 3 == 2) {
                        if (n[i] == '1') {
                            str += tn[Number(n[i + 1])] + ' ';
                            i++;
                            sk = 1;
                        } else if (n[i] != 0) {
                            str += tw[n[i] - 2] + ' ';
                            sk = 1;
                        }
                    } else if (n[i] != 0) {
                        str += dg[n[i]] + ' ';
                        if ((x - i) % 3 == 0)
                            str += 'Hundred ';
                        sk = 1;
                    }
                    if ((x - i) % 3 == 1) {
                        if (sk)
                            str += th[(x - i - 1) / 3] + ' ';
                        sk = 0;
                    }
                }
                if (x != s.length) {
                    var y = s.length;
                    str += 'point ';
                    for (var i = x + 1; i < y; i++)
                        str += dg[n[i]] + ' ';
                }
                return str.replace(/\s+/g, ' ');
            }

			function number_test(n)
			{
				var result = (n - Math.floor(n)) !== 0; 
			   
				if (result)
					return 0;
				else
					return 1;
			}

            function update_current(){

                $.ajax({
                    type: "POST",
                    url: base_url + "/updatebid",
                    dataType: "JSON",
                    beforeSend: function(){
                   
                    },
                    success: function(msg) {
                  
						var border = "";
                        var winloose=0;
                        $.each(msg['data'], function(e, pqlist) {
                            
                            //alert(pqlist.bid_id);
                            //alert(JSON.stringify(msg['data']));
                            
                            var form= $('#bid_form_'+pqlist.bid_id+'');
                        
                            if(pqlist.curent_amount!=null){                            

                                //$('#current_'+pqlist.bid_id+'').text(inr(pqlist.curent_amount));
								//$('#current_'+pqlist.bid_id+'').text(inr(pqlist.curent_amount));
								//$('#current_'+pqlist.bid_id+'').text(Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}));
                                if(pqlist.pea_is_rank_based_auction == 0){
                                    $('#current_'+pqlist.bid_id+'').text(pqlist.pmc_currency_symbol+' '+Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}));
                                     
                                }else{
                                    if(pqlist.seller_id == msg['login_id']){
                                        $('#current_'+pqlist.bid_id+'').text('Rank '+pqlist.rank);
                                    }                                    
                                }

                                $('#current_bid_'+pqlist.bid_id+'').val(pqlist.curent_amount);
                                $('#current_hidden_'+pqlist.bid_id+'').val(pqlist.curent_amount);
                            }
                            else{
                                //$('#current_'+pqlist.bid_id+'').text(null);
								$('#current_'+pqlist.bid_id+'').text('0.00');
								
								$('#current_bid_'+pqlist.bid_id+'').val(0);
                                $('#current_hidden_'+pqlist.bid_id+'').val(0);
                                //$('#total_'+pqlist.bid_id+'').text('NA');
                            }

                            if(pqlist.pla_seller_emailid == msg['login_id'])
                            {
                                if(pqlist.pec_event_type == 2){
                                    if(pqlist.curent_amount!=null){                 
                                        
                                        $('#your_'+pqlist.bid_id+'').css("background", "green");
                                        $('#your_'+pqlist.bid_id+'').css("color", "white");  
                                        if(winloose==2){
                                            winloose= 2;
                                        }else{
                                            winloose= 1;
                                        }
                                        //$('#current_'+pqlist.bid_id+'').css("background", "green");
                                       // $('#current_'+pqlist.bid_id+'').css("color", "white");     
                                    }    
                                }
                            }
                            else
                            {
                                if(pqlist.pec_event_type == 2) {
                                    if(pqlist.curent_amount!=null){     
                                        
                                        $('#your_'+pqlist.bid_id+'').css("background", "brown");
                                        $('#your_'+pqlist.bid_id+'').css("color", "white"); 
                                       if(winloose==2){
                                            winloose= 2;
                                        }else{
                                            winloose= 2;
                                        }
                                       // $('#current_'+pqlist.bid_id+'').css("background", "brown");
                                       // $('#current_'+pqlist.bid_id+'').css("color", "white"); 
                                    }           
                                }
                            }
							
							// if(winloose==2){
                            //     $('.newbid_came_'+pqlist.pec_event_id+'').css("border-left-style", "solid"); 
                            //     $('.newbid_came_'+pqlist.pec_event_id+'').css("border-left-width", "10px"); 
                            //     $('.newbid_came_'+pqlist.pec_event_id+'').css("border-color", "brown"); 
                            // }else if(winloose==1){
                            //     $('.newbid_came_'+pqlist.pec_event_id+'').css("border-left-style", "solid"); 
                            //     $('.newbid_came_'+pqlist.pec_event_id+'').css("border-left-width", "10px"); 
                            //     $('.newbid_came_'+pqlist.pec_event_id+'').css("border-color", "green"); 
                            // }
                            // winloose=0;

                            if(pqlist.pec_event_category ==1)
                            {
                                if(pqlist.pec_event_type == 1)
                                {
                                    multiple = pqlist.req_quantity * pqlist.pla_your_bid;
                                   // num = inr(multiple);
								   num = addCommas(multiple.toFixed(2));
                                    $('#total_'+pqlist.bid_id+'').text(num);
                                }
                                else
                                {
                                    multiple = pqlist.req_quantity * pqlist.pla_your_bid;
                                   // num = inr(multiple);
								   num = addCommas(multiple.toFixed(2));
                                    $('#total_'+pqlist.bid_id+'').text(num); 
                                }                               
                            }
                            else
                            {
                                if(pqlist.pla_your_bid != null)
                                {
                                    multiple = pqlist.req_quantity * pqlist.pla_your_bid;
                                    
                                    //num = addCommas(pqlist.pla_your_bid);
                                    num = addCommas(multiple.toFixed(2));
                                    $('#total_'+pqlist.bid_id+'').text(num); 
                                }
                                else
                                {
                                    $('#total_'+pqlist.bid_id+'').text('0.00'); 
                                }
                               // num = inr(pqlist.pla_your_bid);
							   
                            }                                                      

                        // if(pqlist.curent_amount!=null){
                        //     if(pqlist.pla_seller_emailid == msg['login_id'])
                        //     {
                        //         $('#current_'+pqlist.bid_id+'').css("background", "green");
                        //         $('#current_'+pqlist.bid_id+'').css("color", "white");
                        //         if(pqlist.pec_event_type ==2)
                        //         {
                        //             $('#total_'+pqlist.bid_id+'').text(inr(pqlist.req_quantity * pqlist.pla_your_bid));
                        //         }
                        //         else
                        //         {
                        //             $('#total_'+pqlist.bid_id+'').text(inr(pqlist.pla_your_bid)); 
                        //         }
                        //     }
                        //     else
                        //     {
                        //         $('#current_'+pqlist.bid_id+'').css("background", "brown");
                        //         $('#current_'+pqlist.bid_id+'').css("color", "white");
                        //         if(pqlist.pec_event_type ==2)
                        //         {
                        //             $('#total_'+pqlist.bid_id+'').text(inr(pqlist.req_quantity * pqlist.pla_your_bid));
                        //         }
                        //         else
                        //         {
                        //             $('#total_'+pqlist.bid_id+'').text(inr(pqlist.pla_your_bid)); 
                        //         }
                        //     }

                        //     $('#current_'+pqlist.bid_id+'').text(inr(pqlist.curent_amount));
                        //     $('#current_hidden_'+pqlist.bid_id+'').val(pqlist.curent_amount);
                        // }
                        // else{
                        //     $('#current_'+pqlist.bid_id+'').text(null);
                        //     $('#current_hidden_'+pqlist.bid_id+'').val(0);
                        //     $('#total_'+pqlist.bid_id+'').text('NA');
                        // }
                        
                      //var reserved= form.find('input[name="reserve_bid"]').val(); 
					  var reserved= parseFloat($('#reserve_bid_'+pqlist.bid_id).val());
					  var current= parseFloat($('#current_bid_'+pqlist.bid_id).val());
					  
					  //alert(reserved);
					  //alert(current);

                      //if(pqlist.curent_amount<=reserved && pqlist.curent_amount!=null){
					  if(current<=reserved && current!=null && current != 0){
						  //alert(current);
						  //alert(reserved);
						form.find('input[name="bid_price"]').remove(); 
                        form.find(".reserved_reached").remove();
						form.find("#reserved_reached_append").remove();
						form.find(".btn-purple").remove();
                       
                          form.append('<span id="reserved_reached_append">bid reached reserved amount</span>');
                      }
                        })
               
                        },
                        complete: function() {
                            // Schedule the next request when the current one's complete
                            setTimeout(update_current, 1000);
                        }                       
                    
                })             
            }    
            
			function update_upcoming(){
               
                $.ajax({
                    type: "POST",
                    url: base_url + "/autorefreshUpcoming",
                  
              
                    dataType: "JSON",
                    beforeSend: function(){
                   
                    },
                    success: function(msg) {
                     //   console.log('upcoming');

                        if(msg['status'] == true){
                            if(sessionStorage.sellerupcomingCount)
                            {
                                if(sessionStorage.sellerupcomingCount != msg['data'].length)
                                {
                                    sessionStorage.sellerupcomingCount = msg['data'].length;
                                    iziToast.success({
                                        timeout: 2500,
                                        id: 'success',
                                        title: 'Success',
                                        message: 'Item Moved into Live',
                                        position: 'topRight',
                                        transitionIn: 'fadeInDown',
                                        onOpened: function(instance, toast){
                                            location.reload();	
                                        },
                                    });  
                                }
                                else
                                {
                                    sessionStorage.sellerupcomingCount = msg['data'].length;
                                }
                            }
                            else
                            {
                                sessionStorage.sellerupcomingCount = msg['data'].length;
                            }

                            if(msg['livedata'].length > 0) {
                                $('.upcoming_live_data').show();
                                $('#live_data_count').html(msg['livedata'].length);
                            }
                            else
                            {
                                $('.upcoming_live_data').hide();
                            }
                        }   
                        else{
                            $('.upcoming_live_data').hide();
                        }
                                       
                        },
                        complete: function() {
                            // Schedule the next request when the current one's complete
                            setTimeout(update_upcoming, 5000);
                          }
                       
                    
                })
             
            }
            
            function buyer_upcoming(){
               
                $.ajax({
                    type: "POST",
                    url: base_url + "/autorefreshBuyerUpcoming",
                  
              
                    dataType: "JSON",
                    beforeSend: function(){
                   
                    },
                    success: function(msg) {
                     //   console.log('upcoming');
                        if(sessionStorage.buyerupcomingCount)
                        {
                            if(sessionStorage.buyerupcomingCount != msg.length)
                            {
                                sessionStorage.buyerupcomingCount = msg.length;
                                iziToast.success({
                                    timeout: 2500,
                                    id: 'success',
                                    title: 'Success',
                                    message: 'Item Moved into Live',
                                    position: 'topRight',
                                    transitionIn: 'fadeInDown',
                                    onOpened: function(instance, toast){
                                        location.reload();	
                                    },
                                });  
                            }
                            else
                            {
                                sessionStorage.buyerupcomingCount = msg.length;
                            }
                        }
                        else
                        {
                            sessionStorage.buyerupcomingCount = msg.length;
                        }
                                       
                        },
                        complete: function() {
                            // Schedule the next request when the current one's complete
                            setTimeout(buyer_upcoming, 5000);
                          }
                       
                    
                })
             
            }

            function admin_upcoming(){
               
                $.ajax({
                    type: "POST",
                    url: base_url + "/autorefreshAdminUpcoming",
                  
              
                    dataType: "JSON",
                    beforeSend: function(){
                   
                    },
                    success: function(msg) {
                     //   console.log('upcoming');
                        if(sessionStorage.buyerupcomingCount)
                        {
                            if(sessionStorage.buyerupcomingCount != msg.length)
                            {
                                sessionStorage.buyerupcomingCount = msg.length;
                                iziToast.success({
                                    timeout: 2500,
                                    id: 'success',
                                    title: 'Success',
                                    message: 'Item Moved into Live',
                                    position: 'topRight',
                                    transitionIn: 'fadeInDown',
                                    onOpened: function(instance, toast){
                                        location.reload();	
                                    },
                                });  
                            }
                            else
                            {
                                sessionStorage.buyerupcomingCount = msg.length;
                            }
                        }
                        else
                        {
                            sessionStorage.buyerupcomingCount = msg.length;
                        }
                                       
                        },
                        complete: function() {
                            // Schedule the next request when the current one's complete
                            setTimeout(admin_upcoming, 5000);
                          }
                       
                    
                })
             
            }
			
            function addCommas(nStr) {
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                        x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                return x1 + x2;
            }

          
              

            function update_closed_current(){
                $.ajax({
                    type: "POST",
                    url: base_url + "/updateclosedbidData",
                  
              
                    dataType: "JSON",
                    beforeSend: function(){
                   
                    },
                    success: function(msg) {
						
							if(msg['status'] == true)
							{
								if(sessionStorage.clickcount)
								{
									if(sessionStorage.clickcount != msg['data'].length)
									{
										sessionStorage.clickcount = msg['data'].length;
										iziToast.success({
											timeout: 2500,
											id: 'success',
											title: 'Success',
											message: 'Event Arrived/Event Completed',
											position: 'topRight',
											transitionIn: 'fadeInDown',
											onOpened: function(instance, toast){
												location.reload();	
											},
										});  
									}
									else
									{
										sessionStorage.clickcount = msg['data'].length;
									}
								}
								else
								{
									sessionStorage.clickcount = msg['data'].length;
								}
								
								$.each(msg['data'], function(e, pqlist) {
								 var form= $('#bid_form_'+pqlist.bid_id+'');
								 //var today = new Date();
									//var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
									//var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
									//var dateTime = date+' '+time;
									
                                     var dateTime = msg['systemServerTime'];
                                     
                                    //var eventDate = new Date(pqlist.pea_event_end_dt);
                                     // var hfTimeZone = $('#hfTimeZone').val();
                                    //var myEndDate = new Date(pqlist.pea_event_end_dt).toLocaleString("en-US", {timeZone: hfTimeZone});

									//m = checkTime(eventDate.getMinutes());
									//s = checkTime(eventDate.getSeconds());

									//var date1 = eventDate.getDate()+'-'+(eventDate.getMonth()+1)+'-'+eventDate.getFullYear();
									//var time1 = eventDate.getHours() + ":" + m + ":" + s;
									//var dateTime1 = date1+' '+time1;

									//diff = moment.utc(moment(dateTime1,"DD/MM/YYYY HH:mm:ss").diff(moment(dateTime,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
									//var a = diff.split(':'); // split it at the colons

									// minutes are worth 60 seconds. Hours are worth 60 minutes.
									//var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
									
									// if(dateTime1 < dateTime)
									// {
									//     location.reload();
									// }

									// $('#remain_time_'+pqlist.bid_id+'').css("color","red");
									
									// if(seconds > 60)
									// {
										// $('#remain_time_'+pqlist.bid_id+'').text('Closing Time : '+diff);
									// }
									// else
									// {
										// $('#remain_time_'+pqlist.bid_id+'').text('Closing Time : '+seconds+' Seconds Left');
                                    // }  
                                    
                                    //alert(seconds);

                                    diff = pqlist.diff_in_minutes;
                                    seconds = pqlist.diff_in_seconds;
                                    time_extension_in_seconds = pqlist.pea_time_extension;   

                                    var remain_tim = Math.floor(pqlist.diff_in_seconds / 60);
                                    var remain_sec = pqlist.diff_in_seconds - remain_tim * 60;

									$('#remain_time_'+pqlist.bid_id+'').show();
									if(seconds > time_extension_in_seconds)
									{
										$('#remain_time_'+pqlist.bid_id+'').hide();
									}
									else
									{
										$('#remain_time_'+pqlist.bid_id+'').css("color","red");
																	
										if(seconds > 60)
										{
											$('#remain_time_'+pqlist.bid_id+'').text('Closing Time : '+remain_tim+' Minutes '+remain_sec+' Seconds Left');
										}
										else
										{
											if(seconds >= 1)
											{
												$('#remain_time_'+pqlist.bid_id+'').text('Closing Time : '+seconds+' Seconds Left');
											}
											else
											{
												$('#remain_time_'+pqlist.bid_id+'').text('Closed');
												$('#remain_time_'+pqlist.bid_id+'').hide();
											}
										}    
                                    }
                                    
								
									$('#end_date_'+pqlist.bid_id+'').text(pqlist.edate);                           

									if(pqlist.curent_amount!=null){
										//$('#your_'+pqlist.bid_id+'').text(inr(pqlist.curent_amount));
										//$('#your_'+pqlist.bid_id+'').text(inr(pqlist.curent_amount));
										//$('#your_'+pqlist.bid_id+'').text(Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}));
										$('#your_'+pqlist.bid_id+'').text(pqlist.pmc_currency_symbol+' '+Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}));
									}
									else{
										//$('#your_'+pqlist.bid_id+'').text(null);
										$('#your_'+pqlist.bid_id+'').text('0.00');
									}
													  
								})
								$('#ct').html(msg['serverTime']);
							}
							else
							{
								$('#ct').html(msg['serverTime']);
							}
                        },
                        complete: function() {
                            // Schedule the next request when the current one's complete
                            setTimeout(update_closed_current, 1000);
                          }
                       
                    
                })
             
            }

            function checkTime(i) {
                if (i < 10) {
                  i = "0" + i;
                }
                return i;
              }

            function  update_buyer_current(){
                //console.log("buyer live");
                $.ajax({
                    type: "POST",
                    url: base_url + "/buyerupdatebid",
                  
              
                    dataType: "JSON",
                    beforeSend: function(){
                   
                    },
                    success: function(msg) {

                        console.log("buyer live");
                        
                        $('.add-bid-data').empty();
                        $('.add-bid-data').append('<tr style="background: #fffcf4;"> <td colspan="16"> <div class="final-bidder-details"> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <p> Bid Time </p> </div> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <p> Current Bid </p> </div>  <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <p> Total Price </p> </div> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <p> Savings (In %) </p> </div> </td> </tr>');

                        //$('.active_bidder_count').html(msg.length);
                        $.each(msg, function(e, pqlist) {
							$('.active_bidder_count_'+pqlist.lot_id+'').html(pqlist.bidding_count);
                            $('#buyer_bid_'+pqlist.bid_id+'').html(pqlist.curent_amount);
                            //$('#buyer_lot_'+pqlist.lot_id+'').html('No.of Acceptance : '+pqlist.accept_count);
                            
                            $('#group-of-rows-'+pqlist.lot_id).find("tr:gt(0)").remove();
                            if(pqlist.event_type == 2)
                            {
                                if(pqlist.start_price)
                                {
                                    savings = (((pqlist.start_price - pqlist.curent_amount)/pqlist.start_price)*100);
                                    savings= Math.round(savings*100)/100;
                                       
                                    if(pqlist.quantity)
                                    {
										//savings = (((200 - 100)/7) * 100).toFixed(2);
										//savings = number_format(number, 2); 
                                         $('#group-of-rows-'+pqlist.lot_id).append('<tr> <td colspan="16"> <div class="final-bidder-details"> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> '+ pqlist.date_time +' </span> </div> <div class="live-bid-info bid-highlight-price col-md-3 col-sm-3 col-xs-12"> <p>'+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}) +' </p> </div>  <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span>'+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount * pqlist.quantity).toLocaleString('en', {minimumFractionDigits: 2}) +' </span> </div> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> '+savings+' </span> </div> </td> </tr>');
                                    }
                                    else
                                    {
                                          $('#group-of-rows-'+pqlist.lot_id).append('<tr> <td colspan="16"> <div class="final-bidder-details"> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> '+ pqlist.date_time +' </span> </div> <div class="live-bid-info bid-highlight-price col-md-3 col-sm-3 col-xs-12"> <p> '+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}) +' </p> </div>  <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span>'+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}) +' </span> </div> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> '+savings+' </span> </div> </td> </tr>');
                                    }
                                }
                                else
                                {
                                    $('#group-of-rows-'+pqlist.lot_id).append('<tr> <td colspan="16"> <div class="final-bidder-details"> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> '+ pqlist.date_time +' </span> </div> <div class="live-bid-info bid-highlight-price col-md-3 col-sm-3 col-xs-12"> <p>'+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}) +' </p> </div>  <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span>'+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}) +' </span> </div> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> - </span> </div> </td> </tr>');
                                    
                                }
                            }
                                
                        })
               
                        },
                        complete: function() {
                            // Schedule the next request when the current one's complete
                            setTimeout(update_buyer_current, 2000);
                          }
                       
                    
                })
            }

            function  update_admin_current(){
                //console.log("buyer live");
                $.ajax({
                    type: "POST",
                    url: base_url + "/adminupdatebid",
                  
              
                    dataType: "JSON",
                    beforeSend: function(){
                   
                    },
                    success: function(msg) {

                        console.log("buyer live");
                        
                        $('.add-bid-data').empty();
                        $('.add-bid-data').append('<tr style="background: #fffcf4;"> <td colspan="16"> <div class="final-bidder-details"> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <p> Bid Time </p> </div> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <p> Current Bid </p> </div>  <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <p> Total Price </p> </div> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <p> Savings (In %) </p> </div> </td> </tr>');

                        //$('.active_bidder_count').html(msg.length);
                        $.each(msg, function(e, pqlist) {
							$('.active_bidder_count_'+pqlist.lot_id+'').html(pqlist.bidding_count);
                            $('#buyer_bid_'+pqlist.bid_id+'').html(pqlist.curent_amount);
                            //$('#buyer_lot_'+pqlist.lot_id+'').html('No.of Acceptance : '+pqlist.accept_count);
                            
                            $('#group-of-rows-'+pqlist.lot_id).find("tr:gt(0)").remove();
                            if(pqlist.event_type == 2)
                            {
                                if(pqlist.start_price)
                                {
                                    savings = (((pqlist.start_price - pqlist.curent_amount)/pqlist.start_price)*100);
                                    savings= Math.round(savings*100)/100;
                                       
                                    if(pqlist.quantity)
                                    {
										//savings = (((200 - 100)/7) * 100).toFixed(2);
										//savings = number_format(number, 2); 
                                         $('#group-of-rows-'+pqlist.lot_id).append('<tr> <td colspan="16"> <div class="final-bidder-details"> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> '+ pqlist.date_time +' </span> </div> <div class="live-bid-info bid-highlight-price col-md-3 col-sm-3 col-xs-12"> <p>'+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}) +' </p> </div>  <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span>'+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount * pqlist.quantity).toLocaleString('en', {minimumFractionDigits: 2}) +' </span> </div> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> '+savings+' </span> </div> </td> </tr>');
                                    }
                                    else
                                    {
                                          $('#group-of-rows-'+pqlist.lot_id).append('<tr> <td colspan="16"> <div class="final-bidder-details"> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> '+ pqlist.date_time +' </span> </div> <div class="live-bid-info bid-highlight-price col-md-3 col-sm-3 col-xs-12"> <p> '+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}) +' </p> </div>  <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span>'+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}) +' </span> </div> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> '+savings+' </span> </div> </td> </tr>');
                                    }
                                }
                                else
                                {
                                    $('#group-of-rows-'+pqlist.lot_id).append('<tr> <td colspan="16"> <div class="final-bidder-details"> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> '+ pqlist.date_time +' </span> </div> <div class="live-bid-info bid-highlight-price col-md-3 col-sm-3 col-xs-12"> <p>'+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}) +' </p> </div>  <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span>'+pqlist.currency_symbol+' '+ Number(pqlist.curent_amount).toLocaleString('en', {minimumFractionDigits: 2}) +' </span> </div> <div class="live-bid-info col-md-3 col-sm-3 col-xs-12"> <span> - </span> </div> </td> </tr>');
                                    
                                }
                            }
                                
                        })
               
                        },
                        complete: function() {
                            // Schedule the next request when the current one's complete
                            setTimeout(update_admin_current, 2000);
                          }
                       
                    
                })
            }

            function  update_buyer_current_invite_acceptance(){
                //console.log("buyer live");
                $.ajax({
                    type: "POST",
                    url: base_url + "/buyerupdateinviteacceptance",
                    dataType: "JSON",
                    beforeSend: function(){
                   
                    },
                    success: function(msg) {

                        console.log("acceptance live");
						
							if(msg['status'] == true)
							{
								if(sessionStorage.buyerlivecount)
                                {
                                    if(sessionStorage.buyerlivecount != msg['data'].length)
                                    {
                                        sessionStorage.buyerlivecount = msg['data'].length;
                                        iziToast.success({
                                            timeout: 2500,
                                            id: 'success',
                                            title: 'Success',
                                            message: 'Event Arrived/Event Completed',
                                            position: 'topRight',
                                            transitionIn: 'fadeInDown',
                                            onOpened: function(instance, toast){
                                                location.reload();	
                                            },
                                        });  
                                    }
                                    else
                                    {
                                        sessionStorage.buyerlivecount = msg['data'].length;
                                    }
                                }
                                else
                                {
                                    sessionStorage.buyerlivecount = msg['data'].length;
                                }
								
								$.each(msg['data'], function(e, pqlist) {
									$('#buyer_lot_'+pqlist.lot_id+'').html('Accepted : '+pqlist.accept_count);
									
									$('#end_date_'+pqlist.lot_id+'').text(pqlist.pea_event_end_dt);    
                                    $('#event_end_date_'+pqlist.pec_event_id+'').text(pqlist.pec_event_end_dt);    
							   
								})
							}
							$('#ct').html(msg['serverTime']);

                        },
                        complete: function() {
                            // Schedule the next request when the current one's complete
                            setTimeout(update_buyer_current_invite_acceptance, 2000);
                          }
                       
                    
                })
            }

            function  update_admin_current_invite_acceptance(){
                //console.log("buyer live");
                $.ajax({
                    type: "POST",
                    url: base_url + "/adminupdateInviteAcceptance",
                    dataType: "JSON",
                    beforeSend: function(){
                   
                    },
                    success: function(msg) {

                        console.log("acceptance live");
						
							if(msg['status'] == true)
							{
								if(sessionStorage.buyerlivecount)
                                {
                                    if(sessionStorage.buyerlivecount != msg['data'].length)
                                    {
                                        sessionStorage.buyerlivecount = msg['data'].length;
                                        iziToast.success({
                                            timeout: 2500,
                                            id: 'success',
                                            title: 'Success',
                                            message: 'Event Arrived/Event Completed',
                                            position: 'topRight',
                                            transitionIn: 'fadeInDown',
                                            onOpened: function(instance, toast){
                                                location.reload();	
                                            },
                                        });  
                                    }
                                    else
                                    {
                                        sessionStorage.buyerlivecount = msg['data'].length;
                                    }
                                }
                                else
                                {
                                    sessionStorage.buyerlivecount = msg['data'].length;
                                }
								
								$.each(msg['data'], function(e, pqlist) {
									$('#buyer_lot_'+pqlist.lot_id+'').html('Accepted : '+pqlist.accept_count);
									
									$('#end_date_'+pqlist.lot_id+'').text(pqlist.pea_event_end_dt);    
                                    $('#event_end_date_'+pqlist.pec_event_id+'').text(pqlist.pec_event_end_dt);    
							   
								})
							}
							$('#ct').html(msg['serverTime']);

                        },
                        complete: function() {
                            // Schedule the next request when the current one's complete
                            setTimeout(update_admin_current_invite_acceptance, 2000);
                          }
                       
                    
                })
            }


        function readPOImage(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
    
                reader.onload = function (e) {
                    $('#blah')
                        .attr('src', e.target.result)
                        .width(400)
                        .height(250);

                        // .width(150)
                        // .height(200);
                };
    
                reader.readAsDataURL(input.files[0]);
            }
            else
            {
                $('#blah')
                    .attr('src', '/img/no-image.jpg')
                    .width(100)
                    .height(100);
            }
        }
        function readPO1Image(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
    
                reader.onload = function (e) {
                    $('#blah1')
                        .attr('src', e.target.result)
                        .width(400)
                        .height(250);

                        // .width(150)
                        // .height(200);
                };
    
                reader.readAsDataURL(input.files[0]);
            }
            else
            {
                $('#blah1')
                    .attr('src', '/img/no-image.jpg')
                    .width(100)
                    .height(100);
            }
        }

        function readInvoiceImage(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
    
                reader.onload = function (e) {
                    $('#blahh')
                        .attr('src', e.target.result)
                        .width(400)
                        .height(250);

                        // .width(150)
                        // .height(200);
                };
    
                reader.readAsDataURL(input.files[0]);
            }
            else
            {
                $('#blahh')
                    .attr('src', '/img/no-image.jpg')
                    .width(100)
                    .height(100);
            }
        }

    function payEMDFunction(lot_id)
    {
        $.ajax({
            type: "POST",
            url: base_url + "/validateWalletAmount",
            data: { lot_id: lot_id },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               $('.preloader').hide();

                if(msg['status'] == true)
                {
                    var emd_value = msg['emd_value'];
                    var current_balance = msg['current_balance'];

                    $('#wallet_popup').modal({
                        backdrop: 'static',
                        keyboard: false
                    }) 
                    .one('click', '#confirm-model', function(e) {
                        
                        $.ajax({
                            type: "POST",
                            url: base_url + "/payEmdValue",
                            data:  { lot_id: lot_id, current_balance: current_balance, emd_value: emd_value },                          
                            dataType: "JSON",
                            beforeSend: function(){
                                $('.preloader').show();
                            },
                            success: function(msg) 
                            {
                                $('.preloader').hide();
                                if(msg['status'] == true)
                                {
                                    location.reload();                                   
                                }
                                else
                                {		
                                    iziToast.error({
                                            timeout: 2500,
                                            id: 'error',
                                            title: 'Error',
                                            message: msg['message'],
                                            position: 'topRight',
                                            transitionIn: 'fadeInDown'
                                    });		
                                    //  location.reload();                                            
                                }
                            }
                        })
                    });

                    $('#wallet-text').html('Available Wallet Balance : INR '+msg['current_balance']);
                    $('#emd-text').html(msg['emd_value']);
                    
                    $('#wallet_popup').modal('show');                   
                }
                else{		
                    if(msg['c_code'] == 3)
                    {
                        iziToast.error({
                            timeout: 5000,
                            id: 'error',
                            title: 'Error',
                            message: 'You dont have enough balance in your wallet. Kindly recharge your wallet and try again.',
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });	

                    }
                    else
                    {
                        location.reload();
                    }	                           
                }
            }
        });

    }


    function bidwisePopFunction(lot_id,event_id)
    {
        $('#hfLotId').val(lot_id);
        $('#hfEventId').val(event_id);

        $('#Bid-Export-Report').modal({
            backdrop: 'static',
            keyboard: false
        }) 
        // .one('click', '#confirm-pdf-model', function(e) {

        //     var favorite = [];
        //     $.each($("input[name='biddetail']:checked"), function(){            
        //         favorite.push($(this).val());
        //         alert($(this).val());
        //     });

        //     alert('pdf');
        //     // $.ajax({
        //     //     type: "POST",
        //     //     url: base_url + "/payEmdValue",
        //     //     data:  { lot_id: pea_id_mod, current_balance: current_balance, emd_value: emd_value },                          
        //     //     dataType: "JSON",
        //     //     beforeSend: function(){
        //     //         $('.preloader').show();
        //     //     },
        //     //     success: function(msg) 
        //     //     {
        //     //         $('.preloader').hide();
        //     //         if(msg['status'] == true)
        //     //         {
        //     //             location.reload();                                   
        //     //         }
        //     //         else
        //     //         {		
        //     //             iziToast.error({
        //     //                     timeout: 2500,
        //     //                     id: 'error',
        //     //                     title: 'Error',
        //     //                     message: msg['message'],
        //     //                     position: 'topRight',
        //     //                     transitionIn: 'fadeInDown'
        //     //             });		
        //     //             //  location.reload();                                            
        //     //         }
        //     //     }
        //     // })
        // })
        // .one('click', '#confirm-excel-model', function(e) {
        //     alert('excel');
        //     // $.ajax({
        //     //     type: "POST",
        //     //     url: base_url + "/payEmdValue",
        //     //     data:  { lot_id: pea_id_mod, current_balance: current_balance, emd_value: emd_value },                          
        //     //     dataType: "JSON",
        //     //     beforeSend: function(){
        //     //         $('.preloader').show();
        //     //     },
        //     //     success: function(msg) 
        //     //     {
        //     //         $('.preloader').hide();
        //     //         if(msg['status'] == true)
        //     //         {
        //     //             location.reload();                                   
        //     //         }
        //     //         else
        //     //         {		
        //     //             iziToast.error({
        //     //                     timeout: 2500,
        //     //                     id: 'error',
        //     //                     title: 'Error',
        //     //                     message: msg['message'],
        //     //                     position: 'topRight',
        //     //                     transitionIn: 'fadeInDown'
        //     //             });		                                         
        //     //         }
        //     //     }
        //     // })
        // });
    }

    $("input[name='pea_emd_check']").click(function(){
        var radioValue = $("input[name='pea_emd_check']:checked").val();
        if(radioValue){
            if(radioValue == 1)
            {
                $('#pea_event_emd_value').show();
                $('.emd-div').show();
            }
            else
            {
                $('#pea_event_emd_value').hide();
                $('.emd-div').hide();
            }
        }
    });

    function bidwiseHighPopFunction(lot_id, event_id)
    {
        $('#hfLotId').val(lot_id);
        $('#hfEventId').val(event_id);

        $('#Bid-Export-Report').modal({
            backdrop: 'static',
            keyboard: false
        })        
    }


    function bidwiseOverallPopFunction(event_id, event_type)
    {
        $('#hfEventIt').val(event_id);
        $('.eventIdSpan').html(event_id);
        $('#hfEventType').val(event_type);

        if(event_type == 1)
        {
            $('#lotdetail').each(function(){
                if ($(this).is(':enabled')) {
                    $('#lotdetail[value="9"]').not(this).prop('disabled', 'disabled');
                    $('#lotdetail[value="10"]').not(this).prop('disabled', 'disabled');
                    $('#lotdetail[value="11"]').not(this).prop('disabled', 'disabled');
                }
            });
        }
        else
        {
            $('#lotdetail').each(function(){                
                $('#lotdetail[value="9"]').removeAttr("disabled");
                $('#lotdetail[value="10"]').removeAttr("disabled");
                $('#lotdetail[value="11"]').removeAttr("disabled");                
            });
        }

        $.each($("input[id='lotdetail']"), function(){            
            $(this).prop("checked", false);            
        });
        
        $('#Bid-Overall-Export-Report').modal({
            backdrop: 'static',
            keyboard: false
        }) 
    }
	function edit_cat(event_id)
    {
		 
		/*  $('#edit_cat_model_'+event_id).modal({
            backdrop: 'static',
            keyboard: false
        }) */

        $.ajax({
        type: "POST",
        url: base_url+'/edit_cat_event',
        data: { event_id: event_id},
        dataType: 'JSON',
        beforeSend: function(){
            //$('.preloader').show();
        },
        success: function( msg ) {

            if(msg['status'] == true)
            {
                $('#tbody_'+event_id).empty();
                var i = 1;
                if(msg['data'].length > 0)
                {
                    $.each(msg['data'], function(e, pqlist) {
						//console.log(window.base_url);
						//return;
                         var url = window.base_url+'/'+pqlist.ptc_event_item_terms_condition;
						// $('#tbody_'+event_id).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i>'+ pqlist.ptc_event_item_terms_condition +' </a></td> <td><a href="#" onClick=edit_cat_test("'+ event_id +'","'+ pqlist.ptc_id +'") style="color:blue"><i class="fa fa-edit" title="Edit Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> <td><a href="#" style="color:red" target="_blank"><i class="fa fa-trash-o" title="Delete Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> </tr>');
						 $('#tbody_'+event_id).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i></a></td> <td><a onClick=delete_cat_event_wise_("'+ event_id +'","'+ pqlist.ptc_id +'") style="color:red"><i class="fa fa-trash-o" title="Delete Catelogue" aria-hidden="true"></i></a></td> </tr>');
                        i++;                        
                    });
                }
                else
                {
                    $('#tbody_'+event_id).append('<tr> <td colspan=4> No Records Found </td> </tr>');                        
                }
            }
            else
            {

            }
            //$('.preloader').hide();
        }
    }); 
	
	$("#test_fun_"+event_id).show();
	}
	
	function show_cat_(event_id,item_id)
    {
		
		  $('#show_cat1_'+event_id).modal({
            backdrop: 'static',
            keyboard: false
        })

        $.ajax({
        type: "POST",
        url: base_url+'/show_catalog_itemwise1',
        data: { event_id: event_id,item_id: item_id},
        dataType: 'JSON',
        beforeSend: function(){
            //$('.preloader').show();
        },
        success: function( msg ) {

            if(msg['status'] == true)
            {
                $('#tbody2_'+event_id).empty();
                var i = 1;
                if(msg['data'].length > 0)
                {
                    $.each(msg['data'], function(e, pqlist) {
						  var url = window.base_url+'/'+pqlist.ptc_event_item_terms_condition;
						// $('#tbody_'+event_id).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i>'+ pqlist.ptc_event_item_terms_condition +' </a></td> <td><a href="#" onClick=edit_cat_test("'+ event_id +'","'+ pqlist.ptc_id +'") style="color:blue"><i class="fa fa-edit" title="Edit Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> <td><a href="#" style="color:red" target="_blank"><i class="fa fa-trash-o" title="Delete Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> </tr>');
						 $('#tbody2_'+event_id).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i></a></td></tr>');
                        i++;                        
                    });
                }
                else
                {
					$('#tbody2_'+event_id).append('<tr> <td colspan=4> No Records Found </td> </tr>');  
					                      
                }
            }
            else
            {

            }
            //$('.preloader').hide();
        }
    }); 
	} 


		
	
	function sellershow_cat_(event_id,item_id)
    {
		$('.seller_upshow').attr('id','sellershow_cat1_'+event_id);
		$('.sellercatshow').attr('id','tbody2_'+event_id);
		  $('#sellershow_cat1_'+event_id).modal({
            backdrop: 'static',
            keyboard: false
        })

        $.ajax({
        type: "POST",
        url: base_url+'/sellershow_catalog_itemwise1',
        data: { event_id: event_id,item_id: item_id},
        dataType: 'JSON',
        beforeSend: function(){
            //$('.preloader').show();
        },
        success: function( msg ) {

            if(msg['status'] == true)
            {
                $('#tbody2_'+event_id).empty();
                var i = 1;
                if(msg['data'].length > 0)
                {
                    $.each(msg['data'], function(e, pqlist) {
						  var url = window.base_url+'/'+pqlist.ptc_event_item_terms_condition;
						// $('#tbody_'+event_id).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i>'+ pqlist.ptc_event_item_terms_condition +' </a></td> <td><a href="#" onClick=edit_cat_test("'+ event_id +'","'+ pqlist.ptc_id +'") style="color:blue"><i class="fa fa-edit" title="Edit Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> <td><a href="#" style="color:red" target="_blank"><i class="fa fa-trash-o" title="Delete Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> </tr>');
						 $('#tbody2_'+event_id).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i></a></td></tr>');
                        i++;                        
                    });
                }
                else
                {
					$('#tbody2_'+event_id).append('<tr> <td colspan=4> No Records Found </td> </tr>');  
					                      
                }
            }
            else
            {

            }
            //$('.preloader').hide();
        }
    }); 
	} 
	
	
	
	
	$("#close_catalog1").click(function(){
		$('.event_cataloggg').hide();
	});
	
	
	$("#product_catalog").click(function(){
    
		
		$('#product_catalogall').show();
		var item_id = $('#pmc_id').val();
		var eventID = $('#eventID').val();
	//	alert(item_id);
		//alert(eventID);
       
        $.ajax({
        type: "POST",
        url: base_url+'/show_catalog_itemwise',
        data: { event_id: eventID,item_id: item_id},
        dataType: 'JSON',
        beforeSend: function(){
            //$('.preloader').show();
        },
        success: function( msg ) {
      if(msg['status'] == true)
            {
				 $('#tbody1_'+eventID).empty();
               // $('#tbody1_'+eventID+'_'+item_id).html('');
				 var i = 1;
                if(msg['data'].length > 0)
                {
					//alert("jhgh");
                    $.each(msg['data'], function(e, pqlist) {
						//console.log(window.base_url);
						//return;
                         var url = window.base_url+'/'+pqlist.ptc_event_item_terms_condition;

						// $('#tbody_'+event_id).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i>'+ pqlist.ptc_event_item_terms_condition +' </a></td> <td><a href="#" onClick=edit_cat_test("'+ event_id +'","'+ pqlist.ptc_id +'") style="color:blue"><i class="fa fa-edit" title="Edit Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> <td><a href="#" style="color:red" target="_blank"><i class="fa fa-trash-o" title="Delete Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> </tr>');
						 $('#tbody1_'+eventID).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i></a></td> <td><a href="#" onClick=delete_cat_item_wise_("'+ eventID +'","'+ pqlist.ptc_id +'") style="color:red"><i class="fa fa-trash-o" title="Delete Catelogue" aria-hidden="true"></i></a></td> </tr>');
                        i++;                        
                    });
                }
                else
                {
                    $('#tbody1_'+eventID).append('<tr> <td colspan=4> No Records Found </td> </tr>');                        
                }
            }
            else
            {

            }
            //$('.preloader').hide();
        }
    });  
    }); 
 
$("#service").click(function(){
    
		
		$('#service_catalog_more').show();
		var item_id = $('#edit_s_product #pmc_id').val();
         var eventID = $('#eventID').val();
	
        $.ajax({
        type: "POST",
        url: base_url+'/show_catalog_itemwise',
        data: { event_id: eventID,item_id: item_id},
        dataType: 'JSON',
        beforeSend: function(){
            //$('.preloader').show();
        },
        success: function( msg ) {
            if(msg['status'] == true)
            {
				 $('#tbody3_'+eventID).empty();
               // $('#tbody1_'+eventID+'_'+item_id).html('');
				console.log(msg['data'].length);
                var i = 1;
                if(msg['data'].length > 0)
                {
					//alert("jhgh");
                    $.each(msg['data'], function(e, pqlist) {
						//console.log(window.base_url);
						//return;
                         var url = window.base_url+'/'+pqlist.ptc_event_item_terms_condition;

						// $('#tbody_'+event_id).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i>'+ pqlist.ptc_event_item_terms_condition +' </a></td> <td><a href="#" onClick=edit_cat_test("'+ event_id +'","'+ pqlist.ptc_id +'") style="color:blue"><i class="fa fa-edit" title="Edit Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> <td><a href="#" style="color:red" target="_blank"><i class="fa fa-trash-o" title="Delete Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> </tr>');
						 $('#tbody3_'+eventID).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i></a></td> <td><a href="#" onClick=delete_cat_item_wise_("'+ eventID +'","'+ pqlist.ptc_id +'") style="color:red"><i class="fa fa-trash-o" title="Delete Catelogue" aria-hidden="true"></i></a></td> </tr>');
                        i++;                        
                    });
                }
                else
                {
                    $('#tbody3_'+eventID).append('<tr> <td colspan=4> No Records Found </td> </tr>');                        
                }
            }
            else
            {

            }
            //$('.preloader').hide();
        }
    });  
    }); 
	
	function add_morecat_model_(event_id)
    {
		  $('#open_morecat_model_'+event_id).modal({
            backdrop: 'static',
            keyboard: false
        }) 

        

    }
	function delete_cat_event_wise_(event_id,cat_id)
    {
		$('#delete_item_id1').val(cat_id);
		  $('#delete_morecat_model_'+event_id).modal({
            backdrop: 'static',
            keyboard: false
        }) 
 }
 function delete_cat_item_wise_(event_id,cat_id)
    {
		 $('#delete_item_id').val(cat_id);
		
		  $('#delete_moreitemcat_model_'+event_id).modal({
            backdrop: 'static',
            keyboard: false
        }) 
 }
 
	
 $('#delete_confirm_catalog_model').on("click", function() {
    var event_id = $('#delete_eve_id1').val();
    var item_id = $('#delete_item_id1').val();

   
    $('#cancel_model').modal({
        backdrop: 'static',
        keyboard: false
    })
     $.ajax({
                type: "POST",
                url: base_url + "/deletecatalog",
                data: {
                    event_id: event_id,item_id: item_id
                },
                dataType: "JSON",
            	beforeSend: function(){
            		$('.preloader').show();
            	},
                success: function(e) {
                    $('.preloader').hide();
                    
                    iziToast.success({
                        timeout: 2500,
                        id: 'success',
                        title: 'Success',
                        message: 'Catalog Deleted Successfully',
                        position: 'topRight',
                        transitionIn: 'fadeInDown',
                        onOpened: function(instance, toast){
                            location.reload();	
                        },
                    });                       
                }
            })
  });	
  
  $('#delete_confirm_itemcatalog_model').on("click", function() {
    var event_id = $('#delete_eve_id').val();
    var item_id = $('#delete_item_id').val();

   
    $('#cancel_model1').modal({
        backdrop: 'static',
        keyboard: false
    })
     $.ajax({
                type: "POST",
                url: base_url + "/deletecatalog1",
                data: {
                    event_id: event_id,item_id: item_id
                },
                dataType: "JSON",
            	beforeSend: function(){
            		$('.preloader').show();
            	},
                success: function(e) {	
                    $('.preloader').hide();
                    
                    iziToast.success({
                        timeout: 2500,
                        id: 'success',
                        title: 'Success',
                        message: 'Catalog Deleted Successfully',
                        position: 'topRight',
                        transitionIn: 'fadeInDown',
                       
                    }); 
	$('.cancel_model1').modal('hide');	
$('#product_catalog').trigger('click');
$('#service').trigger('click');
                }
            })
    
  
  });	
	
$("#addcatupload").validate({
	submitHandler: function(form) {
  
 var data = new FormData(form);
 var file_data = $('#term_upload').parents('files')[0];
 data.append('file', file_data);

      // return false;
          $.ajax({
				type: "POST",
				url: base_url+'/add_morecat_upload',
				data: data,
				  cache: false,
                contentType: false,
                processData: false,
				//dataType: 'JSON',
				method: 'POST',
                type: 'POST', // For jQuery < 1.9
				beforeSend: function(){
				  $('.preloader').show();
				},
				success: function( msg ) 
				{
					$('.preloader').hide();         
					
					if(msg['status'] == true)
					{
						//alert("Event Created Successfully ");
						$('.preloader').show();  
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: 'Event Created Successfully',
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
							
						});
					}
					else if(msg['status'] == false){		
						iziToast.error({
							timeout: 3000,
							id: 'error',
							title: 'Error',
							message: msg['message'],
							position: 'topRight',
							transitionIn: 'fadeInDown'
						});
						 //window.location.href	=	base_url+'/payment-status/fail/'+msg['url'];	
					}
				}
          });

  }

});
	
	
	
	

/* 
function edit_cat_test(event_id,term_id)
    {
		 
		 $('#edit_cat_model_'+event_id).modal({
            backdrop: 'static',
            keyboard: false
        }) 
		
		 $.ajax({
        type: "POST",
        url: base_url+'/edit_single_catalog',
        data: { event_id: event_id , term_id: term_id},
        dataType: 'JSON',
        beforeSend: function(){
            //$('.preloader').show();
        },
        success: function( msg ) {

            if(msg['status'] == true)
            {
                $('#tbody_'+event_id).empty();
                var i = 1;
                if(msg['data'].length > 0)
                {
                    $.each(msg['data'], function(e, pqlist) {
                        //bid_amount = inr(pqlist.pbh_cur_bid);
						//bid_amount = Number(pqlist.pbh_cur_bid).toLocaleString('en', {minimumFractionDigits: 2});
						//<a href="{{ url($item->pea_event_terms_condition) }}"  class="table_catalouge" style="color:green" target="_blank"></a>
                       var url = "{{ url('+pqlist.ptc_event_item_terms_condition+') }}";
						 $('#tbody_'+event_id).append('<tr> <td> '+ i +' </td> <td><a href="'+url+'" style="color:green" target="_blank"><i class="fa fa-eye" title="View Catelogue" aria-hidden="true"></i>'+ pqlist.ptc_event_item_terms_condition +' </a></td> <td><a href="#" onClick=edit_cat_test("'+ event_id +'","'+ ptc_id +'") style="color:blue"><i class="fa fa-edit" title="Edit Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> <td><a href="#" style="color:red" target="_blank"><i class="fa fa-trash-o" title="Delete Catelogue" aria-hidden="true"></i> '+ pqlist.ptc_id +' </a></td> </tr>');
                        i++;                        
                    });
                }
                else
                {
                    $('#tbody_'+event_id).append('<tr> <td colspan=4> No Records Found </td> </tr>');                        
                }
            }
            else
            {

            }
            //$('.preloader').hide();
        }
    }); 
	
			
	} */											

    function bidwiseHistoryPopFunction(event_id, event_type, lot_id)
    {
        $('#hfEventIt').val(event_id);
        $('#hfLotIt').val(lot_id);
        $('.eventIdSpan').html(event_id);
        $('#hfEventType').val(event_type);
        
        $('#Bid-History-Export-Report').modal({
            backdrop: 'static',
            keyboard: false
        }) 
    }
    
    $('#confirm-bid-history-cancel-model').click(function()
    {
        $('#Bid-History-Export-Report').modal('hide');
	 });
	$('#delete_cancel').click(function()
    {
        $('.cancel_model').modal('hide');
    });
	$('#delete_cancel_item').click(function()
    {
        $('.cancel_model1').modal('hide');
    });
	$('.close_catalog').click(function()
    {
        $('#product_catalogall').hide();
        $('#service_catalog_more').hide();
    });
										  
	
	function acceptrejectPopFunction(event_id, event_type, lot_id)
    {
        $('#hfEventIt').val(event_id);
        $('#hfLotIt').val(lot_id);
        $('.eventIdSpan').html(event_id);
        $('#hfEventType').val(event_type);
        
        $('#Accept-Reject-Export-Report').modal({
            backdrop: 'static',
            keyboard: false
        }) 
    }

    $('#confirm-bid-accept-cancel-model').click(function()
    {
        $('#Accept-Reject-Export-Report').modal('hide');
    });

   $('#bid-wise-report-form').click(function()
    {
        $('#Accept-Reject-Export-Report').modal('hide');
        $('#Bid-History-Export-Report').modal('hide');
        $('#Bid-Overall-Export-Report').modal('hide');
    });
	
    $('#reject-po-cancel-model').click(function()
    {
        $('#rejectForm').modal('hide');
    });

    $('#confirm-bid-lot-cancel-model').click(function()
    {
        $('#Bid-Overall-Export-Report').modal('hide');
    });
	$('#confirm_edit_cat_cancel_model').click(function()
    {
        $('.cat_cancel').modal('hide');
    });

    $('#confirm-bid-cancel-model').click(function()
    {
        $('#Bid-Export-Report').modal('hide');
    });

    $('#confirm-high-bid-cancel-model').click(function()
    {
        $('#High-Bid-Export-Report').modal('hide');
    });

    $('#select_all').click(function()
    {
        $.each($("input[id='biddetail']"), function(){            
            $(this).prop("checked", true);            
        });
        
    });
    
    $('#all_select_all').click(function()
    {
        var event_type = $('#hfEventType').val();

        if(event_type == 2)
        {
            $.each($("input[id='lotdetail']"), function(){            
                $(this).prop("checked", true);            
            });
        }
        else
        {            
            $.each($("input[id='lotdetail']"), function(){
                $(this).prop("checked", true);    
                $('#lotdetail[value="9"]').prop("checked", false); 
                $('#lotdetail[value="10"]').prop("checked", false); 
                $('#lotdetail[value="11"]').prop("checked", false); 
            });
        }
        
    });

    $('#all_unselect_all').click(function()
    {
        $.each($("input[id='lotdetail']"), function(){            
            $(this).prop("checked", false);            
        });
        
    });    

    $('#unselect_all').click(function()
    {
        $.each($("input[id='biddetail']"), function(){            
            $(this).prop("checked", false);            
        });
        
    });

$(document).ready(function(){

   // $('#confirm-cred').hide();

    $('.pay-seller-money').click(function()
    {
        var current_bid_id = $(this).attr('id');
        var accepted_amount = $(this).attr('data-bidid');
        var lot_id = $(this).attr('data-lot-id');

        $.ajax({
            type: "POST",
            url: base_url + "/validateWalletAmount",
            data: { lot_id: lot_id, current_bid_id: current_bid_id, accepted_amount: accepted_amount  },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               $('.preloader').hide();

                if(msg['status'] == true)
                {                   
                    var current_balance = msg['current_balance'];
                    var total_amount = parseInt(accepted_amount)+parseInt(msg['total_emd']);

                    $('#wallet_popup').modal({
                        backdrop: 'static',
                        keyboard: false
                    }) 
                    .one('click', '#confirm-model', function(e) {

                        if(parseInt(current_balance) >= total_amount)
                        {
                            $.ajax({
                                type: "POST",
                                url: base_url + "/payToSeller",
                                data:  { lot_id: lot_id, current_balance: current_balance, accepted_amount: accepted_amount, current_bid_id: current_bid_id },                          
                                dataType: "JSON",
                                beforeSend: function(){
                                    $('.preloader').show();
                                },
                                success: function(msg) 
                                {
                                    $('.preloader').hide();
                                    if(msg['status'] == true)
                                    {
                                        location.reload();                                   
                                    }
                                    else
                                    {		
                                        iziToast.error({
                                                timeout: 2500,
                                                id: 'error',
                                                title: 'Error',
                                                message: msg['message'],
                                                position: 'topRight',
                                                transitionIn: 'fadeInDown'
                                        });		
                                        //  location.reload();                                            
                                    }
                                }
                            })
                        }
                        else
                        {
                            alert('Not enough amount available in your wallet');
                        }                        
                        
                    });                    

                    $('#emd-return').html('Total EMD to return : INR '+msg['total_emd']);
                    $('#total-pay').html('Total Amount deduct from your wallet : INR '+total_amount);
                    $('#wallet-text').html('Available Wallet Balance : INR '+msg['current_balance']);
                    $('#emd-text').html(accepted_amount);
                    
                    $('#wallet_popup').modal('show');                   
                }
                else{		
                    if(msg['c_code'] == 3)
                    {
                        iziToast.error({
                            timeout: 5000,
                            id: 'error',
                            title: 'Error',
                            message: 'You dont have enough balance in your wallet. Kindly recharge your wallet and try again.',
                            position: 'topRight',
                            transitionIn: 'fadeInDown'
                        });	

                    }
                    else
                    {
                        location.reload();
                    }	                           
                }
            }
        });
    });

    $('.invoice-seller').click(function() {
        var auctionId = $(this).attr('id');
        var accepted_amount = $(this).attr('data-bidid');
        var seller_id = $(this).attr('data-sellerid');
        var lotItemId = $(this).attr('data-lot-id');

        $.ajax({
            type: "POST",
            url: base_url + "/winnerInvoice",
            data: { auctionId: auctionId, lotItemId: lotItemId, accepted_amount: accepted_amount, seller_id: seller_id  },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               $('.preloader').hide();

                if(msg['status'] == true)
                {                   
                    iziToast.success({
                        timeout: 2500,
                        id: 'success',
                        title: 'Success',
                        message: msg['message'],
                        position: 'topRight',
                        transitionIn: 'fadeInDown',
                        onOpened: function(instance, toast){
                            location.reload();	
                        },
                    });                 
                }
                else{		
                    iziToast.error({
                        timeout: 5000,
                        id: 'error',
                        title: 'Error',
                        message: msg['message'],
                        position: 'topRight',
                        transitionIn: 'fadeInDown'
                    });	                         
                }
            }
        });

    });

    // var event_id = $('#bid_pec_event_name').val();
    // if(event_id)
    // {
    //     $('#bid_pec_lot_name').show();
    // }
    // else
    // {
    //     $('#bid_pec_lot_name').hide();
    // }

    // var comp_id = $('#pec_company_name').val();
    // if(comp_id)
    // {
    //     $('#pec_event_name').show();
    // }
    // else
    // {
    //     $('#pec_event_name').hide();
    // }

    $('#bid_pec_event_name').change(function()
    {
        var event_id = $('#bid_pec_event_name').val();
       
        $('#bid_pec_lot_name').show();

        $.ajax({
            type: "POST",
            url: base_url + "/eventLotData",
            data: { event_id: event_id },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               
               $('.preloader').hide();

                if(msg['status'] == true)
                {    
                    $("#bid_pec_lot_name").empty();
                    $("#bid_pec_lot_name").append($("<option></option>").val(0).html('-- ALL --'));
                    $.each(msg['message'], function (key, value) {  
                        $("#bid_pec_lot_name").append($("<option></option>").val(value.pea_id).html(value.pea_event_spec));  
                    });                
                }
                else{		
                                            
                }
            }
        });
    });

    $('#admin_bid_pec_event_name').change(function()
    {
        var event_id = $('#admin_bid_pec_event_name').val();
       
        $('#admin_bid_pec_lot_name').show();

        $.ajax({
            type: "POST",
            url: base_url + "/admineventLotData",
            data: { event_id: event_id },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               
               $('.preloader').hide();

                if(msg['status'] == true)
                {    
                    $("#admin_bid_pec_lot_name").empty();
                    $("#admin_bid_pec_lot_name").append($("<option></option>").val(0).html('-- ALL --'));
                    $.each(msg['message'], function (key, value) {  
                        $("#admin_bid_pec_lot_name").append($("<option></option>").val(value.pea_id).html(value.pea_event_spec));  
                    });                
                }
                else{		
                                            
                }
            }
        });
    });

	$('#accept_pec_event_name').change(function()
    {
        var event_id = $('#accept_pec_event_name').val();
       
        $('#bid_pec_lot_name').show();

        $.ajax({
            type: "POST",
            url: base_url + "/accepteventLotData",
            data: { event_id: event_id },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               
               $('.preloader').hide();

                if(msg['status'] == true)
                {    
                    $("#bid_pec_lot_name").empty();
                    $("#bid_pec_lot_name").append($("<option></option>").val(0).html('-- ALL --'));
                    $.each(msg['message'], function (key, value) {  
                        $("#bid_pec_lot_name").append($("<option></option>").val(value.pea_id).html(value.pea_event_spec));  
                    });                
                }
                else{		
                                            
                }
            }
        });
    });


	  $('#consolidate_report_event_type').change(function()
    {
		//alert("dsfgh");
        var event_type = $('#consolidate_report_event_type').val();
        $("#bid_pec_event_name").empty();
        
        var htimeZone = $('#hfTimeZone').val();
              
        $.ajax({
            type: "POST",
            url: base_url + "/eventTypeEvents",
            data: { event_type: event_type },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               
               $('.preloader').hide();

                if(msg['status'] == true)
                {    
                    $("#bid_pec_event_name").empty();
                    $("#bid_pec_event_name").append($("<option></option>").val(null).html('-- Choose Event --'));
                    $.each(msg['message'], function (key, value) {  

                        //var startd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_start_dt, htimeZone);
                        //var endd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_end_dt, htimeZone);
                        
                        //$("#bid_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+startd+' - '+endd+' ] '));  
                        $("#bid_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+value.pec_event_start_dt+' - '+value.pec_event_end_dt+' ] '));
                    });                
                }
                else{		
                                            
                }
            }
        });
    });	

    $('#admin_consolidate_report_event_type').change(function()
    {
		//alert("dsfgh");
        var event_type = $('#admin_consolidate_report_event_type').val();
        $("#admin_bid_pec_event_name").empty();
        
        var htimeZone = $('#hfTimeZone').val();
              
        $.ajax({
            type: "POST",
            url: base_url + "/admineventTypeEvents",
            data: { event_type: event_type },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               
               $('.preloader').hide();

                if(msg['status'] == true)
                {    
                    $("#admin_bid_pec_event_name").empty();
                    $("#admin_bid_pec_event_name").append($("<option></option>").val(null).html('-- Choose Event --'));
                    $.each(msg['message'], function (key, value) {  

                        //var startd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_start_dt, htimeZone);
                        //var endd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_end_dt, htimeZone);
                        
                        //$("#bid_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+startd+' - '+endd+' ] '));  
                        $("#admin_bid_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+value.pec_event_start_dt+' - '+value.pec_event_end_dt+' ] '));
                    });                
                }
                else{		
                                            
                }
            }
        });
    });	
    
    $('#bid_accept_report_event_type').change(function()
    {
		//alert("dsfgh");
        var event_type = $('#bid_accept_report_event_type').val();
        $("#bid_pec_event_name").empty();
        var htimeZone = $('#hfTimeZone').val();
       
        $.ajax({
            type: "POST",
            url: base_url + "/bidacceptEvents",
            data: { event_type: event_type },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               
               $('.preloader').hide();

                if(msg['status'] == true)
                {    
                    $("#bid_pec_event_name").empty();
                    $("#bid_pec_event_name").append($("<option></option>").val(null).html('-- Choose Event --'));
                    $.each(msg['message'], function (key, value) {  
                        //var startd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_start_dt, htimeZone);
                        //var endd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_end_dt, htimeZone);
                        //$("#bid_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+startd+' - '+endd+' ] ')); 
                        $("#bid_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+value.pec_event_start_dt+' - '+value.pec_event_end_dt+' ] '));   
                    });                
                }
                else{		
                                            
                }
            }
        });
    });

    $('#admin_bid_accept_report_event_type').change(function()
    {
		//alert("dsfgh");
        var event_type = $('#admin_bid_accept_report_event_type').val();
        $("#admin_bid_pec_event_name").empty();
        var htimeZone = $('#hfTimeZone').val();
       
        $.ajax({
            type: "POST",
            url: base_url + "/adminbidacceptEvents",
            data: { event_type: event_type },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               
               $('.preloader').hide();

                if(msg['status'] == true)
                {    
                    $("#admin_bid_pec_event_name").empty();
                    $("#admin_bid_pec_event_name").append($("<option></option>").val(null).html('-- Choose Event --'));
                    $.each(msg['message'], function (key, value) {  
                        //var startd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_start_dt, htimeZone);
                        //var endd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_end_dt, htimeZone);
                        //$("#bid_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+startd+' - '+endd+' ] ')); 
                        $("#admin_bid_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+value.pec_event_start_dt+' - '+value.pec_event_end_dt+' ] '));   
                    });                
                }
                else{		
                                            
                }
            }
        });
    });
    
    
	$('#accept_report_event_type').change(function()
    {
		//alert("dsfgh");
        var event_type = $('#accept_report_event_type').val();
        $("#accept_pec_event_name").empty();
        var htimeZone = $('#hfTimeZone').val();
       
        $.ajax({
            type: "POST",
            url: base_url + "/acceptRejectEvents",
            data: { event_type: event_type },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               
               $('.preloader').hide();

                if(msg['status'] == true)
                {    
                    $("#accept_pec_event_name").empty();
                    $("#accept_pec_event_name").append($("<option></option>").val(null).html('-- Choose Event --'));
                    $.each(msg['message'], function (key, value) {
                        //var startd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_start_dt, htimeZone);
                        //var endd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_end_dt, htimeZone);
                          
                        //$("#accept_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+startd+' - '+endd+' ] '));  
                        $("#accept_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+value.pec_event_start_dt+' - '+value.pec_event_end_dt+' ] '));  
                    });                
                }
                else{		
                                            
                }
            }
        });
    });

    $('#admin_accept_report_event_type').change(function()
    {
		//alert("dsfgh");
        var event_type = $('#admin_accept_report_event_type').val();
        $("#accept_pec_event_name").empty();
        var htimeZone = $('#hfTimeZone').val();
       
        $.ajax({
            type: "POST",
            url: base_url + "/adminacceptRejectEvents",
            data: { event_type: event_type },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               
               $('.preloader').hide();

                if(msg['status'] == true)
                {    
                    $("#accept_pec_event_name").empty();
                    $("#accept_pec_event_name").append($("<option></option>").val(null).html('-- Choose Event --'));
                    $.each(msg['message'], function (key, value) {
                        //var startd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_start_dt, htimeZone);
                        //var endd = convertServerDatetoMyTimezoneFormattedDate(value.pec_event_end_dt, htimeZone);
                          
                        //$("#accept_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+startd+' - '+endd+' ] '));  
                        $("#accept_pec_event_name").append($("<option></option>").val(value.pec_event_id).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+value.pec_event_start_dt+' - '+value.pec_event_end_dt+' ] '));  
                    });                
                }
                else{		
                                            
                }
            }
        });
    });
	
	$('#pec_company_name').change(function()
    {
        var comp_id = $('#pec_company_name').val();

        $('#pec_event_name').show();
       
        $.ajax({
            type: "POST",
            url: base_url + "/sellerEventData",
            data: { comp_id: comp_id },              
            dataType: "JSON",
            beforeSend: function(){
              $('.preloader').show();
            },
            success: function(msg) {
               
               $('.preloader').hide();

                if(msg['status'] == true)
                {    
                    $("#pec_event_name").empty();
                    $("#pec_event_name").append($("<option></option>").val(0).html('-- ALL --'));
                    $.each(msg['message'], function (key, value) {  
                        $("#pec_event_name").append($("<option></option>").val(value.pec_sno).html(value.pec_event_id+' - '+value.pec_event_name+' [ '+value.pec_event_start_dt+'-'+value.pec_event_end_dt+' ] '));  
                    });                
                }
                else{		
                                            
                }
            }
        });
    });


/* $(".changeCategory").on("change", function() {
 $('.cat_other').hide();
	$('.subcat_other').hide();
 
    var categories = $(this).val();
	if(categories==45 || categories==65 || categories==64)
		  {
			// alert(";lkjhb");
				$('.cat_other').show();
			
		  }
		else{
			
			$('.cat_other').hide();
		
 
		}
    var cat_type= $("#com_cat_type").val();

        $.ajax({
            type: "POST",
            url: base_url + "/getSubproduct",
            data: {
                cat: categories,
                cat_type:cat_type
            },
            dataType: "JSON",
            beforeSend: function(){
                $('.preloader').show();
                },
            success: function(e) {
                    $('.preloader').hide();
                    $("#pms_subcat_name").empty();
					  $("#pms_subcat_name").append("<option value='0'>-- Choose Your Sub Category --</option>")
                    $.each(e, function(e, t) {
                        $("#pms_subcat_name ").append($("<option></option>").attr("value", t.pms_id).text(t.pms_subcat_name))
                    })
            }
        })        
  }) */

	
 $('body').on('click', '.btn-edit-row', function() {
  $('#product_catalogall').hide();
	
	 $('#pms_subcat_name').css('pointer-events','none'); 
	 $('#pmc_cat_name').css('pointer-events','none'); 
	 $('#pmc_market_name').css('pointer-events','none'); 
		  $('#edit_product').modal({
            backdrop: 'static',
            keyboard: false
        }) 
    
        $("#pmc_cat_name")[0].removeAttribute("onchange", "categoryChangeFunction()");
    
        var event_type = $(this).attr('data-event-type');

		var pea_id = $(this).closest('tr').attr('id');
		 var announcement = $(this).attr('data-announcement');
		var pea_id_mod = $(this).attr('data-id');
        var cat = $(this).attr('data-cat-id');
        var market_id = $(this).attr('data-market-id');
        sub_cat = $(this).attr('data-subcat-id');
        var unit = $(this).attr('data-unit-id');
        var currency = $(this).attr('data-currency-id');
        var currentRow = $(this).closest("tr"); 
        var pmc_market_name = currentRow.find("td:eq(0)").html();
		var pmc_cat_name = currentRow.find("td:eq(1)").html();
		var pms_subcat_name = currentRow.find("td:eq(2)").html();
		var pea_event_start_dt = currentRow.find("td:eq(3)").html();
		var pea_event_end_dt = currentRow.find("td:eq(4)").html();
		var pea_event_spec = currentRow.find("td:eq(5)").html();
		var pmu_unit_name = currentRow.find("td:eq(6)").html();
        var pea_event_unit_quantity = currentRow.find("td:eq(7)").html();		
		var country =  $(this).attr('data-Country');
        var location =  $(this).attr('data-location');
		 var pro_name =  $(this).attr('data-pro_name');																	  
        var term_catalouge =  $(this).attr('data-term_catalouge');
		//alert(term_catalouge);
       // var mkt_other_txt =  $(this).attr('data-mkt_other_txt');
      //  var cat_other_txt =  $(this).attr('data-cat_other_txt');
       // var subcat_other_txt =  $(this).attr('data-subcat_other_txt');
        									  
        
		
        if(event_type == 2)
        {
            var pea_event_start_price = currentRow.find("td:eq(8)").html();
            var pea_event_max_dec = currentRow.find("td:eq(9)").html();
            var pea_event_reserve_price = currentRow.find("td:eq(10)").html();
            var pea_event_location = currentRow.find("td:eq(11)").html();
            var pea_currency = currentRow.find("td:eq(12)").html();	
        }
        else
        {
            var pea_event_location = currentRow.find("td:eq(8)").html();
            var pea_currency = currentRow.find("td:eq(9)").html();	
        }
		
		//$('#pmc_id').attr('id', pea_id);
		$('#pmc_id').val(pea_id);
        //$('#pmc_cat_name').val(pmc_cat_name);
        //$("#pmc_cat_name option[value="+cat+"]").prop("selected",true);

        $('#pmc_market_name').val(pmc_market_name);
        $("#pmc_market_name option[value="+market_id+"]").prop("selected",true);
   
        var cat_type= $("#com_cat_type").val();
        $.ajax({
            type: "POST",
            url: base_url + "/getChangeCategories",
            data: {
                market: market_id,
                cat_type:cat_type,
                cat: cat
            },
            dataType: "JSON",
            beforeSend: function(){
                $('.preloader').show();
            },
            success: function(e) {
                
                $('.preloader').hide();
                $("#pmc_cat_name").empty();
                $("#pms_subcat_name").empty();

                $("#pmc_cat_name").append("<option value='0'>-- Choose Your Categories --</option>")
                //$('#pmc_cat_name').addClass('changeCategory')
                $("#pmc_cat_name")[0].setAttribute("onchange", "categoryChangeFunction()");


                if(e['status'] == true){
                    $.each(e['category'], function(e, t) {
                        $("#pmc_cat_name ").append($("<option></option>").attr("value", t.pmc_id).text(t.pmc_cat_name))
                    })

                    $('#pmc_cat_name').val(pmc_cat_name);
                    $("#pmc_cat_name option[value="+cat+"]").prop("selected",true);  
                    
                
                    $.each(e['subcategory'], function(e, t) {
                        //alert(t.pms_id);
                        $("#pms_subcat_name").append($("<option></option>").attr("value", t.pms_id).text(t.pms_subcat_name))
                    })
                    $('#pms_subcat_name').val(pms_subcat_name);
                    $("#pms_subcat_name option[value="+sub_cat+"]").prop("selected",true);
                }
                else{
                    
                }

                /* $.ajax({
                    type: "POST",
                    url: base_url + "/getSubproduct",
                    data: {
                        cat: cat,
                        cat_type:cat_type
                    },
                    dataType: "JSON",
                    beforeSend: function(){
                        $('.preloader').show();
                        },
                    success: function(e) {               
                            $('.preloader').hide();
                            $("#pms_subcat_name").empty();
                            $.each(e, function(e, t) {
                                $("#pms_subcat_name").append($("<option></option>").attr("value", t.pms_id).text(t.pms_subcat_name))
                            })
                            $('#pms_subcat_name').val(pms_subcat_name);
                            $("#pms_subcat_name option[value="+sub_cat+"]").prop("selected",true);
                    }
                }) */
            }
        })       

        $('#pmc_cat_name').val(cat).trigger('change');
        $('#pms_subcat_name').val(sub_cat).trigger('change');
        $("#pmu_unit_name option[value="+unit+"]").prop("selected",true);
        $("#pea_currency option[value="+currency+"]").prop("selected",true);
        $('#pea_event_spec').val(pea_event_spec);
		 $('#pea_event_announcement').val(announcement);
        var announcement_remaining_text = 255 - announcement.length;
        $('.announcement_rchars_edit').html(announcement_remaining_text);
        $('#pea_event_start_dt').val(pea_event_start_dt);
        $('#pea_event_end_dt').val(pea_event_end_dt);
        var remaining_text = 255 - pea_event_spec.length;
        $('.rchars_edit').html(remaining_text);
        $('#pea_event_unit_quantity').val(pea_event_unit_quantity);
        //$("#pea_event_location option[value="+pea_event_location+"]").prop("selected",true);
        //$('#pea_event_location').val(pea_event_location);

        if(event_type == 2)
        {
            //new lines 08/09
            pea_event_reserve_price = pea_event_reserve_price.replace(/,/g,"");
            pea_event_start_price = pea_event_start_price.replace(/,/g,"");
            pea_event_max_dec = pea_event_max_dec.replace(/,/g,"");
            
            $('#edit_product #pea_event_reserve_price').val(Number(pea_event_reserve_price));
            $('#edit_product #pea_event_start_price').val(Number(pea_event_start_price));
            $('#edit_product #pea_event_max_dec').val(Number(pea_event_max_dec));
            
            //$('#pea_event_reserve_price').val(pea_event_reserve_price);
            //$('#pea_event_start_price').val(pea_event_start_price);
            //$('#pea_event_max_dec').val(pea_event_max_dec);
        }
        else
        {
           /* $('label[for="pea_event_reserve_price"]').hide();
            $('label[for="pea_event_start_price"]').hide();
            $('label[for="pea_event_max_dec"]').hide();
            $('#pea_event_reserve_price').hide();
            $('#pea_event_start_price').hide();
            $('#pea_event_max_dec').hide(); */
            
            $('.p_reserve_price').hide();
            $('.p_min_dec').hide();
            $('.p_floor_price').hide();
        }
         //$('#pea_event_location').val(pea_event_location).change();	
		$("#country_name option[value='"+country+"']").prop("selected",true);
		$('#country_name').val(country);
		$('#Location').val(location);
		$('#pro_name').val(pro_name);														   
		
		

		$(".product_catalogue").attr("href", base_url+'/'+term_catalouge)
		//$('a #edit_product #product').attr("href", base_url+'/'+term_catalouge)
		//alert($('a').attr("href", base_url+'/'+term_catalouge));
		/* if (!$.trim(mkt_other_txt)){   
			$('.mkt_other').hide();
		}
		else{   
			$('.mkt_other').show();
			$('.mkt_other_txt').val(mkt_other_txt);
		}
		if (!$.trim(cat_other_txt)){   
			$('.cat_other').hide();
		}
		else{   
			$('.cat_other').show();
			$('.cat_other_txt').val(cat_other_txt);
		}
		if (!$.trim(subcat_other_txt)){   
			$('.subcat_other').hide();
		}
		else{   
			$('.subcat_other').show();
			$('.subcat_other_txt').val(subcat_other_txt);
		} */
		
        $('#country_name').val(country).change();
	});
    
    $('body').on('click', '.btn-service-edit-row', function() {
		$("#service_catalog_more").hide();
	 $('.pointerevents').css('pointer-events','none'); 				   
               $('#edit_s_product').modal({
        backdrop: 'static',
        keyboard: false
    }) 
        var event_type = $(this).attr('data-event-type');

		var pea_id = $(this).closest('tr').attr('id');
		var announcement = $(this).attr('data-announcement');
		var pea_id_mod = $(this).attr('data-id');
        var cat = $(this).attr('data-cat-id');
        var market_id = $(this).attr('data-market-id');
        var currency = $(this).attr('data-currency-id');
		   var unit = $(this).attr('data-unit-id');														 
        var currentRow = $(this).closest("tr"); 
		var pmc_cat_name = currentRow.find("td:eq(1)").html();
		var pea_event_start_dt = currentRow.find("td:eq(2)").html();
		var pea_event_end_dt = currentRow.find("td:eq(3)").html();
        var pea_event_spec = currentRow.find("td:eq(4)").html();	
			var pmu_unit_name = currentRow.find("td:eq(5)").html();	
		 var pea_event_unit_quantity = currentRow.find("td:eq(6)").html();		
																		
		var country =  $(this).attr('data-Country');
        var location =  $(this).attr('data-location');									  
       var term_catalouge =  $(this).attr('data-term_catalouge');									  
       // var cat_other_txt =  $(this).attr('data-cat_other_txt');									  
           var pro_name =  $(this).attr('data-pro_name');      
        if(event_type == 2)
        {
            var pea_event_start_price = currentRow.find("td:eq(5)").html();
            var pea_event_max_dec = currentRow.find("td:eq(6)").html();
            var pea_event_reserve_price = currentRow.find("td:eq(7)").html();
            var pea_event_location = currentRow.find("td:eq(8)").html();
            var pea_currency = currentRow.find("td:eq(9)").html();	
        }
        else
        {
            var pea_event_location = currentRow.find("td:eq(5)").html();
            var pea_currency = currentRow.find("td:eq(6)").html();	
        }
		
		$('#edit_s_product #pmc_id').val(pea_id);
   
        var cat_type= $("#com_cat_type").val();
        $.ajax({
            type: "POST",
            url: base_url + "/getCategories",
            data: {
                market: market_id,
                cat_type:cat_type
            },
            dataType: "JSON",
            beforeSend: function(){
                $('.preloader').show();
            },
            success: function(e) {
                $('.preloader').hide();
                $("#edit_s_product #pmc_cat_name").empty();
                $("#edit_s_product #pmc_cat_name").append("<option value='0'>-- Choose Your Categories --</option>")
                $.each(e, function(e, t) {
                    $("#edit_s_product #pmc_cat_name ").append($("<option></option>").attr("value", t.pmc_id).text(t.pmc_cat_name))
                })
                $('#edit_s_product #pmc_cat_name').val(pmc_cat_name);
                $("#edit_s_product #pmc_cat_name option[value="+cat+"]").prop("selected",true);
            }
        })

       
        $('#edit_s_product #pmc_cat_name').val(cat).trigger('change');
		$('#edit_s_product #pea_event_announcement').val(announcement);
        var announcement_remaining_text = 255 - announcement.length;
        $('#edit_s_product .announcement_rchars_edit').html(announcement_remaining_text);
        $('#edit_s_product #pea_event_spec').val(pea_event_spec);
        var remaining_text = 255 - pea_event_spec.length;
        $('#edit_s_product .rchars_edit').html(remaining_text);
        $('#edit_s_product #pea_event_start_dt').val(pea_event_start_dt);
        $('#edit_s_product #pea_event_end_dt').val(pea_event_end_dt);
        $("#edit_s_product #pea_currency option[value="+currency+"]").prop("selected",true);
          
        if(event_type == 2)
        {
            pea_event_reserve_price = pea_event_reserve_price.replace(/,/g,"");
            pea_event_start_price = pea_event_start_price.replace(/,/g,"");
            pea_event_max_dec = pea_event_max_dec.replace(/,/g,"");
            
            $('#edit_s_product #pea_event_reserve_price').val(Number(pea_event_reserve_price));
            $('#edit_s_product #pea_event_start_price').val(Number(pea_event_start_price));
            $('#edit_s_product #pea_event_max_dec').val(Number(pea_event_max_dec));
            
            /* $('#edit_s_product #pea_event_reserve_price').val(pea_event_reserve_price);
            $('#edit_s_product #pea_event_start_price').val(pea_event_start_price);
            $('#edit_s_product #pea_event_max_dec').val(pea_event_max_dec); */
        }
        else
        {
            /* $('#edit_s_product #pea_event_reserve_price').hide();
            $('#edit_s_product #pea_event_start_price').hide();
            $('#edit_s_product #pea_event_max_dec').hide();
            $('label[for="pea_event_reserve_price"]').hide();
            $('label[for="pea_event_start_price"]').hide();
            $('label[for="pea_event_max_dec"]').hide(); */
            
            $('.s_reserve_price').hide();
            $('.s_min_dec').hide();
            $('.s_floor_price').hide();
        }
        //$('#edit_s_product #pea_event_location').val(pea_event_location).change();
        //alert(location);
        $('#edit_s_product #Location').val(location);
		$("#edit_s_product #country_name option[value='"+country+"']").prop("selected",true);
		$('#edit_s_product #country_name').val(country);	
       // $('#edit_s_product #Location').val(location);
		$('#edit_s_product #pro_name').val(pro_name);
		$('#edit_s_product #pea_event_unit_quantity').val(pea_event_unit_quantity);
		 $("#edit_s_product #pmu_unit_name option[value="+unit+"]").prop("selected",true);
		//$('.service_catalogue').attr("href", base_url+'/'+term_catalouge)
		//alert($('a #edit_s_product #service').attr("href", base_url+'/'+term_catalouge));
		/* if (!$.trim(cat_other_txt)){   
			//alert("What follows is blank: " + mkt_other_txt);
			$('.cat_other').hide();
		}
		else{   
			$('.cat_other').show();
			$('#edit_s_product .cat_other_txt').val(cat_other_txt);
		} */
        $('#edit_s_product #country_name').val(country).change();											   
	
	});
	
	
	 $('body').on('click', '.own_vender', function() {
			$(".radio_invite").prop('checked', false);
        $(".own_vendor_invite_radio").hide();
		 $(".bulk_upload_invite_radio").hide();
			 $("#sample_file").hide();
		 $("#sample_email").hide();
		  $('#bulk_email_id-error').hide();
			   
           $('#invite_ownvendor').modal({
        backdrop: 'static',
        keyboard: false
    }) 
        $('.inviteSu').show();
        $('.success_val').hide();
        $('.alert-mail').remove();
        $('form').trigger("reset");
		var pea_id = $(this).closest('tr').attr('id');
        var pea_id_mod = $(this).attr('data-id');
        var pea_event_id = $(this).attr('data-event-id');
        var created_login_id = $(this).attr('data-login-id');
		var event_name = $(this).attr('data-event_name');
		var event_start_dt = $(this).attr('data-event_start_dt');
		var event_end_dt = $(this).attr('data-event_end_dt');
        var term_condition = $(this).attr('data-term_condition');
        var sellerid = $(this).attr('data-seller');
        var event_type = $(this).attr('data-event');
        var event_category = $(this).attr('data-event-cat');
         var pro_name = $(this).attr('data-pro_name');											 
		 										 
        //alert(pro_name);
		var currentRow = $(this).closest("tr"); 
        var pmc_market_name = currentRow.find("td:eq(0)").html();
        var pmc_cat_name = currentRow.find("td:eq(1)").html();
        
        if(event_category == 1){
            var pms_subcat_name = currentRow.find("td:eq(2)").html();
            var pea_event_spec = currentRow.find("td:eq(5)").html();	
            var pmu_unit_name = currentRow.find("td:eq(6)").html();
            var pea_event_unit_quantity = currentRow.find("td:eq(7)").html(); 
            var pea_event_location = currentRow.find("td:eq(8)").html();           

            if(event_type ==2)
            {
                var pea_event_start_price = currentRow.find("td:eq(9)").html();
                var pea_event_max_dec = currentRow.find("td:eq(10)").html();
            }
        }
        else
        {
			  var pea_event_unit_quantity = $(this).attr('data-pea_event_unit_quantity');											 
		 var pmu_unit_name = $(this).attr('data-pmu_unit_name');	
       		 var pea_event_spec = currentRow.find("td:eq(4)").html();	
            var pea_event_location = currentRow.find("td:eq(5)").html();

            if(event_type ==2)
            {
                var pea_event_start_price = currentRow.find("td:eq(6)").html();
                var pea_event_max_dec = currentRow.find("td:eq(7)").html();
            }
        }		
        
		//$('#pmc_id').attr('id', pea_id);
        $('#pmc1_id').val(pea_id);
        $('#market_name').val(pmc_market_name);
        $('#item_created_loginid').val(created_login_id); 
        $('#event_id').val(pea_event_id);
		$('#cat_name').val(pmc_cat_name);
		$('#subcat_name').val(pms_subcat_name);
		$('#event_spec').val(pea_event_spec);
		$('#unit_name').val(pmu_unit_name);
		$('#event_unit_quantity').val(pea_event_unit_quantity);
		$('#event_location').val(pea_event_location);
        $('#event_start_price').val(pea_event_start_price);
        $('#event_type').val(event_type);
        $('#event_category').val(event_category);
		$('#pro_name').val(pro_name);									
        
		$('#event_max_dec').val(pea_event_max_dec);
		$('#pec_event_name').val(event_name);
		$('#pec_event_start_dt').val(event_start_dt);
        $('#pec_event_end_dt').val(event_end_dt);
        $('#pea_event_terms_condition').val(term_condition);
        $('#pec_loginID').val(sellerid);
        
		$('.invite_pqemails').val('');
		$('.invite_emails').val('');
	
	});
	
	$('body').on('click', '.pq_vender', function() {
        $('.invited-newlist').empty();
        var pea_id = $(this).closest('tr').attr('id');
        var cat_id = $(this).closest('tr').attr('date-catid');
        var created_login_id = $(this).attr('data-login-id');
		var pea_id_mod = $(this).attr('data-id');
		var pec_event_id = $(this).attr('data-event-id');
        var pec_event_cat = $(this).attr('data-event-cat');
		var event_name = $(this).attr('data-event_name');
		var terms_condition = $(this).attr('data-term_condition');
		var event_category_id = $(this).attr('data-category');
        var event_category_name = $(this).attr('data-category-name');
		
		var event_start_dt = $(this).attr('data-event_start_dt');
        var event_end_dt = $(this).attr('data-event_end_dt');
        var sellerid = $(this).attr('data-seller');
        var event_type = $(this).attr('data-event');
        var event_category = $(this).attr('data-event-cat');

        var currentRow = $(this).closest("tr"); 
        var pmc_market_name = currentRow.find("td:eq(0)").html();
        var pmc_cat_name = currentRow.find("td:eq(1)").html();

        if(event_category == 1){
            var pms_subcat_name = currentRow.find("td:eq(2)").html();
            var pea_event_spec = currentRow.find("td:eq(5)").html();	
            var pmu_unit_name = currentRow.find("td:eq(6)").html();
            var pea_event_unit_quantity = currentRow.find("td:eq(7)").html();

            if(event_type ==2)
            {   
                var pea_event_start_price = currentRow.find("td:eq(9)").html();
                var pea_event_max_dec = currentRow.find("td:eq(10)").html();
				var pea_event_location = currentRow.find("td:eq(12)").html(); 
            }else{
                var pea_event_location = currentRow.find("td:eq(9)").html(); 
            }
        }
        else
        {
            var pea_event_spec = currentRow.find("td:eq(4)").html();	

            if(event_type ==2)
            {   
                var pea_event_start_price = currentRow.find("td:eq(8)").html();
                var pea_event_max_dec = currentRow.find("td:eq(9)").html();
				var pea_event_location = currentRow.find("td:eq(11)").html();
            }else{
                var pea_event_location = currentRow.find("td:eq(8)").html();
            }
        }
		
		//alert(pea_event_spec);
		//alert(pea_event_location);
        
		// var pms_subcat_name = currentRow.find("td:eq(1)").html();
		// var pea_event_spec = currentRow.find("td:eq(4)").html();
		// var pmu_unit_name = currentRow.find("td:eq(5)").html();
		// var pea_event_unit_quantity = currentRow.find("td:eq(6)").html();
		// var pea_event_location = currentRow.find("td:eq(7)").html();
		// var pea_event_start_price = currentRow.find("td:eq(8)").html();
		// var pea_event_max_dec = currentRow.find("td:eq(9)").html();
				
		
		//$('#pmc_id').attr('id', pea_id);
        $('#pmc1_id1').val(pea_id);
        $('#cat_id1').val(cat_id);
        
        $('#cat_name1').val(pmc_cat_name);
        $('#item_created_loginid').val(created_login_id); 
		//$('#subcat_name1').val(pms_subcat_name);
		$('#subcat_name1').val(event_category_name);
		$('#event_spec1').val(pea_event_spec);
		$('#unit_name1').val(pmu_unit_name);
		$('#event_unit_quantity1').val(pea_event_unit_quantity);
		$('#event_location1').val(pea_event_location);
		$('#event_start_price1').val(pea_event_start_price);
		$('#event_max_dec1').val(pea_event_max_dec);
		$('#pec_event_name1').val(event_name);
		$('#pec_event_start_dt1').val(event_start_dt);
        $('#pec_event_end_dt1').val(event_end_dt);
		$('#pec_event_id').val(pec_event_id);
        $('#event_category').val(pec_event_cat);
        $('#event_type').val(event_type);
        $('#pea_event_terms_condition').val(terms_condition);
        $('#pec_loginID').val(sellerid);
		
		$('.invite_pqemails').val('');
		$('.invite_emails').val('');
        
	
		 $.ajax({
              type: "POST",
              url: base_url+'/getPqvendorNew',
              data: { category_id : cat_id,location : pea_event_location,lotid:pea_id, event_category_id:event_category_id},
              dataType: 'JSON',			  
			  beforeSend: function(){
				  $('.preloader').show();
			  },
              success: function( msg ) {
               //console.log(msg);
			   $('.preloader').hide();
               if(msg.length>0){
                html='';
               
               html+='<table class="table table-striped" id="pq_vendor_select">';
               html+='<thead>';
               html+='	<tr>';
               html+='		<th>Select</th>';
               html+='		<th>Company</th>';
               html+='		<th>Email</th>';
               html+='		<th>Rating</th>';
               html+='	</tr>';
               html+='</thead>';
               html+='<tbody>';
               $.each(msg, function(e, pqlist) {
               html+='		<tr>';
               html+='		<td id="pq_company_id">';
               html+='			<label class="check-vendor">';
			   html+='				<input class="pq_vendor_email" type="checkbox" name="is_name'+pqlist.pmv_id+'" value='+pqlist.pmv_comp_email+'>';
               html+='				<span class="check-checkmark"></span>';
               html+='			</label>';
               html+='		</td>';
               html+='		<td id="pq_company"><a target="_blank" href="/vendor-profile/'+pqlist.pmv_id+'">'+pqlist.pmv_comp_name+'</a></td>';
               html+='		<td id="pq_company_email">'+pqlist.pmv_comp_email+'</td>';
               html+='		<td class="vendor-star-rate">';
               html+='			<i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star" aria-hidden="true"></i>';
               html+='		</td>';
               html+='	</tr>';
                });	
               html+='	</tbody>';
               html+='</table>';
               html+= '<div class="col-md-12 col-xs-12 col-sm-12 block-btn-submit">';
               html+='<input type="submit" class="btn btn-purple" id="pq-vendor-invite" name="SUBMIT">';
               html+='</div>';
               html+='<input type="hidden" class="form-control invite_pqemails" id="invite_pqemails" name="pei_invite_details1">';
               $('.invited-newlist').append(html);	
               /*
				   iziToast.success({
						timeout: 2500,
						id: 'success',
						title: 'Success',
						message: 'Thanks for signing up for Purchase Quick. <br/> Please verify your email address.',
						position: 'bottomRight',
						transitionIn: 'bounceInLeft'						
					});
				$('form').trigger("reset");*/
                }
                else{
				/*	iziToast.error({
						timeout: 3000,
						id: 'error',
						title: 'Error',
						message: 'The email address you have entered is already registered.',
						position: 'topRight',
						transitionIn: 'fadeInDown'
                    });*/
                    html="<p class='no-vendor'>No PQ vendor Available</p> "
                    $('.invited-newlist').append(html);	
                }
          
          }
          });
	
	});
	


           $('body').on('click','.pq_vendor_email',function(){ 
			
			
			var array_values = [];
			$('input[type=checkbox]').each( function() {
				if( $(this).is(':checked') ) {
					array_values.push( $(this).val() );
				}
			});
			var arrayValues = array_values.join(',');
		
				
				 $('.invite_pqemails').val(arrayValues)
				 $('.invite_emails').val(arrayValues)
			  
          

        });
		

	$('body').on('click','.btn-close-mail ,.btn-close',function(){
		
		$('.invite_pqemails').val('');
		$('.invite_emails').val('');
		
    });
   
     
    $('.datetimes1').on('apply.daterangepicker', function(ev, picker) {
       $('#event-detail-form').valid();
      });
     
	$('body').on('click','#pq-vendor-invite',function(){
	
		  $.ajax({
              type: "POST",
              url: base_url+'/inviteSupplier',
              data: { 
				  pmc_cat_nam: $('#cat_name1').val(),
				  pro_name: $('#pro_name').val(), 
				  pms_subcat_name: $('#subcat_name1').val(), 
				  pea_event_spec: $('#event_spec1').val(), 
				  pmu_unit_name: $('#unit_name1').val(), 
				  pea_event_unit_quantity: $('#event_unit_quantity1').val(), 
				  pea_event_start_price: $('#event_start_price1').val(), 
				  pea_event_max_dec: $('#event_max_dec1').val(), 
				  pea_event_location: $('#event_location1').val(), 
				  pmc_id: $('#pmc1_id1').val(), 
				  pea_event_id: $('#pec_event_id').val(),
                  event_category: $('#event_category').val(),   
				  pec_event_name: $('#pec_event_name1').val(), 
				  pec_event_start_dt: $('#pec_event_start_dt1').val(), 
				  pec_event_end_dt: $('#pec_event_end_dt1').val(), 
				  pec_loginID: $('#pec_loginID').val(), 
				  pea_event_terms_condition: $('#pea_event_terms_condition').val(), 
				  pei_invite_details: $('#pei_invite_details1').val(), 
				  pei_invite_details1: $('#pei_invite_details1').val() ,
				  join : "1"
			  },
              dataType: 'JSON',
			  beforeSend: function(){
				  $('.preloader').show();
			  },
              success: function( msg ) {
               //console.log(msg);
               if(msg['status']==true){
				$('.preloader').hide();
                // $("#status").html('<div class="alert-mail alert alert-success">'+"Event Invited success fully."+'</div>');
				// $('.inviteSu').hide();
				// $('.success_val').show();
				iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: 'This supplier has already been invited',
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
							
						});
                }
                else{
					 iziToast.error({
							timeout: 3000,
							id: 'error',
							title: 'Error',
							message: 'Please Enter Any your email address',
							position: 'topRight',
							transitionIn: 'fadeInDown'
						});
					$('.preloader').hide();
                //$("#status").html('<div class="alert-mail alert alert-danger"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Please Enter Any your email address."+'</div>');
				//$('.inviteSu').hide();
				//$('.success_val').show(); 
                }
          
          }
          });

	});	
	
	
  $('.success_val').hide();
  
	$("#inviteSupp").validate({
	
  /* rules: {
    // simple rule, converted to {required:true}
		pei_invite_details: {
			email: true
		}    
    },
 */
  submitHandler: function(form) {
  
 var data = new FormData(form);
  var file_data = $('#bulk_email_id').prop('files')[0];
  data.append('file', file_data);
  //var formdate = $('#inviteSupp').serializeArray();
  
  //console.log(formdate);
	
        //return false;
          $.ajax({
              type: "POST",
              url: base_url+'/inviteSupplier',
              data: data,
              dataType: 'JSON',
				  cache: false,
                contentType: false,
                processData: false,				   																					   
			  beforeSend: function(){
                    $('.preloader').show();
                    iziToast.info({
                        timeout: 3000,
                        id: 'info',
                        title: 'Info',
                        message: 'Invitation sending to suppliers. Kindly do not refresh the page',
                        position: 'bottomRight',
                        transitionIn: 'bounceInLeft',            
                    });
			  },
              success: function( msg ) {
               //console.log(msg);
               if(msg['status']==true){
				$('.preloader').hide();
                // $("#status").html('<div class="alert-mail alert alert-success">'+"Event Invited success fully."+'</div>');
				// $('.inviteSu').hide();
				// $('.success_val').show();
				iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: 'This supplier has been invited',
							position: 'bottomRight',
							transitionIn: 'bounceInLeft',
							onOpened: function(instance, toast){
								location.reload();	
							},
							onClosed: function(instance, toast, closedBy){		
								
								$('.preloader').hide();
								console.info('closedBy: ' + closedBy);
							}
							
						});
                }
                else{
					 iziToast.error({
							timeout: 3000,
							id: 'error',
							title: 'Error',
							//message: 'Please Enter Any your email address',
							 message: msg['message'],  
							position: 'topRight',
							transitionIn: 'fadeInDown'
						});
					$('.preloader').hide();
                //$("#status").html('<div class="alert-mail alert alert-danger"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Please Enter Any your email address."+'</div>');
				//$('.inviteSu').hide();
				//$('.success_val').show(); 
                }
          
          }
          });

  }

});


$("#add-bank-info-form").validate({	
   
    rules: {
        pbd_name: {
            required: true
        },
        pbd_email : {
            required: true
        },
        pbd_phone : {
            required: true
        },
        pbd_bank_account : {
            required: true
        },
        pbd_ifsc : {
            required: true
        },
        pbd_address1 : {
            required: true
        },
        pbd_city: {
            required: true
        },
        pbd_state: {
            required: true
        },
        pbd_pin: {
            required: true
        }
      
    },
  submitHandler: function(form) {
  
    var formdate=$('#add-bank-info-form').serializeArray();
      
       // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/addNewBank',
              data: formdate,
              dataType: 'JSON',
              beforeSend: function(){
                    $('.preloader').show();
                },
                success: function( msg ) {				
                      
                    if(msg['status']==true)
                    {
                      $('.preloader').hide();
                      
                      iziToast.success({
                          timeout: 2500,
                          id: 'success',
                          title: 'Success',
                          message: msg['message'],
                          position: 'bottomRight',
                          transitionIn: 'bounceInLeft',
                          onOpened: function(instance, toast){
                            window.location.href	=	base_url+'/list-bank/'; 
                        },						
                      });
                      $('#force_reset_password').modal('hide');
                      //window.location = base_url;
                   
                    }
                    else{
                       $('.preloader').hide();
                       iziToast.error({
                          timeout: 3000,
                          id: 'error',
                          title: 'Error',
                          message: msg['message'],
                          position: 'topRight',
                          transitionIn: 'fadeInDown'
                      });
                    }
          
                }
        });
    }

});

$("#add-address-info-form").validate({	
   
    rules: {
        psa_address_line1: {
            required: true,
        },       
        psa_state : {
            required: true
        },
        psa_city : {
            required: true
        },
        psa_pincode : {
            required: true
        },
        psa_country : {
            required: true
        }      
    },
  submitHandler: function(form) {
  
    var formdate=$('#add-address-info-form').serializeArray();
      
       // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/addAddress',
              data: formdate,
              dataType: 'JSON',
              beforeSend: function(){
                    $('.preloader').show();
                },
                success: function( msg ) {				
                      
                    if(msg['status']==true)
                    {
                      $('.preloader').hide();
                      
                      iziToast.success({
                          timeout: 2500,
                          id: 'success',
                          title: 'Success',
                          message: msg['message'],
                          position: 'bottomRight',
                          transitionIn: 'bounceInLeft',
                          onOpened: function(instance, toast){
                            window.location.href	=	base_url+'/list-address/'; 
                        },						
                      });
                    }
                    else{
                       $('.preloader').hide();
                       iziToast.error({
                          timeout: 3000,
                          id: 'error',
                          title: 'Error',
                          message: msg['message'],
                          position: 'topRight',
                          transitionIn: 'fadeInDown'
                      });
                    }
                }
        });
    }

});


$("#update-address-info-form").validate({	
   
    rules: {
        psa_address_line1: {
            required: true,
        },       
        psa_state : {
            required: true
        },
        psa_city : {
            required: true
        },
        psa_pincode : {
            required: true
        },
        psa_country : {
            required: true
        }      
    },
  submitHandler: function(form) {
  
    var formdate=$('#update-address-info-form').serializeArray();
      
       // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/updateAddress',
              data: formdate,
              dataType: 'JSON',
              beforeSend: function(){
                    $('.preloader').show();
                },
                success: function( msg ) {				
                      
                    if(msg['status']==true)
                    {
                      $('.preloader').hide();
                      
                      iziToast.success({
                          timeout: 2500,
                          id: 'success',
                          title: 'Success',
                          message: msg['message'],
                          position: 'bottomRight',
                          transitionIn: 'bounceInLeft',
                          onOpened: function(instance, toast){
                            window.location.href	=	base_url+'/list-address/'; 
                        },						
                      });
                    }
                    else{
                       $('.preloader').hide();
                       iziToast.error({
                          timeout: 3000,
                          id: 'error',
                          title: 'Error',
                          message: msg['message'],
                          position: 'topRight',
                          transitionIn: 'fadeInDown'
                      });
                    }
                }
        });
    }

});

$(".delete_address").click(function() {	
   
    var addressId=  $(this).attr('data-id');
      
       // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/deleteAddress',
              data: {'addressId':addressId},
              dataType: 'JSON',
              beforeSend: function(){
                    $('.preloader').show();
                },
                success: function( msg ) {				
                      
                    if(msg['status']==true)
                    {
                      $('.preloader').hide();
                      
                      iziToast.success({
                          timeout: 2500,
                          id: 'success',
                          title: 'Success',
                          message: msg['message'],
                          position: 'bottomRight',
                          transitionIn: 'bounceInLeft',
                          onOpened: function(instance, toast){
                            location.reload();
                            },							
                      });
                                         
                    }
                    else{
                       $('.preloader').hide();
                       iziToast.error({
                          timeout: 3000,
                          id: 'error',
                          title: 'Error',
                          message: msg['message'],
                          position: 'topRight',
                          transitionIn: 'fadeInDown'
                      });
                    }
          
                }
        });
    

});

$("#psa_country").on("change", function() {
 
    var country_id = $("#psa_country").val();

    $.ajax({
        type: "POST",
        url: base_url + "/getCountryStates",
        data: {
            country_id: country_id
        },
        dataType: "JSON",
        beforeSend: function(){
            $('.preloader').show();
          },
        success: function(e) {
              $('.preloader').hide();
              $("#psa_state").empty();
              $('#psa_state').val(0).trigger('change');
              $("#psa_state").append("<option value=''>-- Choose Your States --</option>")
              $.each(e, function(e, t) {
              $("#psa_state ").append($("<option></option>").attr("value", t.id).text(t.name))
            })
        }
    })
  })

$("#psa_state").on("change", function() {
 
    var country_id = $("#psa_country").val();
    var state_id = $("#psa_state").val();

    $.ajax({
        type: "POST",
        url: base_url + "/getLocations",
        data: {
            state_id: state_id,
            country_id: country_id
        },
        dataType: "JSON",
        beforeSend: function(){
            $('.preloader').show();
          },
        success: function(e) {
              $('.preloader').hide();
              $("#psa_city").empty();
              $('#psa_city').val(0).trigger('change');
              $("#psa_city").append("<option value=''>-- Choose Your Cities --</option>")
              $.each(e, function(e, t) {
              $("#psa_city ").append($("<option></option>").attr("value", t.id).text(t.name))
            })
        }
    })
  })


$("#confirm-bank").validate({	
    rules: {
        radioBeneId: {
            required: true
        },              
    },
  submitHandler: function(form) {
  
    var formdate=$('#confirm-bank').serializeArray();
      
       // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/confirmBank',
              data: formdate,
              dataType: 'JSON',
              beforeSend: function(){
                    $('.preloader').show();
                },
                success: function( msg ) {				
                      
                    if(msg['status']==true)
                    {
                        window.location.href	=	base_url+'/accept-bank/'+msg['id']+'/'+msg['bene_id'];
                    }
                    else{
                       $('.preloader').hide();
                       iziToast.error({
                          timeout: 3000,
                          id: 'error',
                          title: 'Error',
                          message: msg['message'],
                          position: 'topRight',
                          transitionIn: 'fadeInDown'
                      });

                    }          
                }
        });
    }

});

$("#debit-amount").validate({	
    rules: {
        pbd_amount: {
            required: true
        },   
        login_username: {
            required: true
        },
        login_password: {
            required: true
        }
    },
  submitHandler: function(form) {
  
    var formdate=$('#debit-amount').serializeArray();

        var enter_amount = parseInt($('#pbd_amount').val());
        var balance_amount = parseInt($('#balance').val());

        if(enter_amount > balance_amount)
        {
            alert('Enter the valid amount');
            return false;
        }
        else
        {
            $.ajax({
                type: "POST",
                url: base_url+'/debitAmount',
                data: formdate,
                dataType: 'JSON',
                beforeSend: function(){
                        $('.preloader').show();
                    },
                    success: function( msg ) {				
                        
                        if(msg['status']==true)
                        {
                            $('.preloader').hide();
                            
                            iziToast.success({
                                timeout: 2500,
                                id: 'success',
                                title: 'Success',
                                message: msg['message'],
                                position: 'bottomRight',
                                transitionIn: 'bounceInLeft',
                                onOpened: function(instance, toast){
                                    window.location.href	=	base_url+'/wallet/'; 
                                },							
                            });
                            
                            //location.reload();
                                              
                        }
                        else
                        {
                            $('.preloader').hide();
                            iziToast.error({
                                timeout: 3000,
                                id: 'error',
                                title: 'Error',
                                message: msg['message'],
                                position: 'topRight',
                                transitionIn: 'fadeInDown'
                            });
                        }
            
                    }
            });
        }
    }

});

$("#delete-bank").validate({	
    rules: {
        radioBeneId: {
            required: true
        },              
    },
  submitHandler: function(form) {
  
    var formdate=$('#delete-bank').serializeArray();
      
       // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/deleteBank',
              data: formdate,
              dataType: 'JSON',
              beforeSend: function(){
                    $('.preloader').show();
                },
                success: function( msg ) {				
                      
                    if(msg['status']==true)
                    {
                      $('.preloader').hide();
                      
                      iziToast.success({
                          timeout: 2500,
                          id: 'success',
                          title: 'Success',
                          message: msg['message'],
                          position: 'bottomRight',
                          transitionIn: 'bounceInLeft',
                          onOpened: function(instance, toast){
                            location.reload();
                            },							
                      });
                      
                      location.reload();
                   
                    }
                    else{
                       $('.preloader').hide();
                       iziToast.error({
                          timeout: 3000,
                          id: 'error',
                          title: 'Error',
                          message: msg['message'],
                          position: 'topRight',
                          transitionIn: 'fadeInDown'
                      });
                    }
          
                }
        });
    }

});

$("#bank-info-form").validate({	
   
    rules: {
        pbd_name: {
            required: true
        },
        pbd_email : {
            required: true
        },
        pbd_phone : {
            required: true
        },
        pbd_bank_account : {
            required: true
        },
        pbd_ifsc : {
            required: true
        },
        pbd_address1 : {
            required: true
        },
        pbd_city: {
            required: true
        },
        pbd_state: {
            required: true
        },
        pbd_pin: {
            required: true
        }
      
    },
  submitHandler: function(form) {
  
    var formdate=$('#bank-info-form').serializeArray();
      
       // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/addBankInfo',
              data: formdate,
              dataType: 'JSON',
              beforeSend: function(){
                    $('.preloader').show();
                },
                success: function( msg ) {				
                      
                    if(msg['status']==true)
                    {
                      $('.preloader').hide();
                      
                      iziToast.success({
                          timeout: 2500,
                          id: 'success',
                          title: 'Success',
                          message: msg['message'],
                          position: 'bottomRight',
                          transitionIn: 'bounceInLeft'							
                      });
                      $('#force_reset_password').modal('hide');
                      //window.location = base_url;
                   
                    }
                    else{
                       $('.preloader').hide();
                       iziToast.error({
                          timeout: 3000,
                          id: 'error',
                          title: 'Error',
                          message: msg['message'],
                          position: 'topRight',
                          transitionIn: 'fadeInDown'
                      });
                    }
          
                }
        });
    }

});

$("#bank-confirm").validate({	
   
    rules: {
              
    },
  submitHandler: function(form) {
  
    var formdate=$('#bank-confirm').serializeArray();
      
       // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/confirmBank',
              data: formdate,
              dataType: 'JSON',
              beforeSend: function(){
                    $('.preloader').show();
                },
                success: function( msg ) {				
                      
                    if(msg['status']==true)
                    {
                      $('.preloader').hide();
                      
                      iziToast.success({
                          timeout: 2500,
                          id: 'success',
                          title: 'Success',
                          message: msg['message'],
                          position: 'bottomRight',
                          transitionIn: 'bounceInLeft'							
                      });
                      $('#force_reset_password').modal('hide');
                      //window.location = base_url;
                   
                    }
                    else{
                       $('.preloader').hide();
                       iziToast.error({
                          timeout: 3000,
                          id: 'error',
                          title: 'Error',
                          message: msg['message'],
                          position: 'topRight',
                          transitionIn: 'fadeInDown'
                      });
                    }
          
                }
        });
    }

});

$("#new_password").keyup(function(event){
    $('#result').html(checkStrength($('#new_password').val()))
});

function checkStrength(password) {
    var strength = 0
    if (password.length < 6) {
    $('#result').removeClass()
    $('#result').addClass('short')
    $('#result').css('color', 'orange')
    $('#resultNote').html('Kindly include special character and number in your password');
    $('.change-password-submit').prop('disabled', true);
    return 'Too short'
    }if (password.length > 7) strength += 1
    // If password contains both lower and uppercase characters, increase strength value.
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
    // If it has numbers and characters, increase strength value.
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
    // If it has one special character, increase strength value.
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // If it has two special characters, increase strength value.
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // Calculated strength value, we can return messages
    // If value is less than 2
    if (strength < 2) {
    $('#result').removeClass()
    $('#result').addClass('weak')
    $('#result').css('color', 'red')
    $('#resultNote').html('Kindly include special character and number in your password');
    $('.change-password-submit').prop('disabled', true);
    return 'Weak'
    } else if (strength == 2) {
    $('#result').removeClass()
    $('#result').addClass('good')
    $('#result').css('color', 'blue')
    $('#resultNote').html('');
    $('.change-password-submit').prop('disabled', false);
    return 'Good'
    } else {
    $('#result').removeClass()
    $('#result').addClass('strong')
    $('#result').css('color', 'green')
    $('#resultNote').html('');
    $('.change-password-submit').prop('disabled', false);
    return 'Strong'
    }
}

$("#force_reset").validate({
	
   
      rules: {
        new_password: "required",
        confirm_password: {
          equalTo: "#new_password"
        }
      },
      messages: {
        confirm_password: "Password entries do not match"
    },
    submitHandler: function(form) {
    
    var formdate = $('#new_password').val();
    
    var email =$('#email').val();
      
         // return false;
            $.ajax({
                type: "POST",
                url: base_url+'/restpass',
                data: {'password':formdate,'email':email},
                dataType: 'JSON',
                beforeSend: function(){
                    $('.preloader').show();
                  },
                  success: function( msg ) {				
                        
                      if(msg['status']==true)
                      {
                        $('.preloader').hide();
                        
						iziToast.success({
							timeout: 2500,
							id: 'success',
							title: 'Success',
							message: 'Password Reset Successfully',
							position: 'bottomRight',
							transitionIn: 'bounceInLeft'							
						});
                        $('#force_reset_password').modal('hide');
                        //window.location = base_url;
                     
                      }
                      else{
                         $('.preloader').hide();
						 iziToast.error({
							timeout: 3000,
							id: 'error',
							title: 'Error',
							message: 'Invalid Details.',
							position: 'topRight',
							transitionIn: 'fadeInDown'
						});
                      }
            
                }
            });
  
    }
  
  });
    
  
	$(function(){

	  $(':input[type=number]').on('mousewheel',function(e){ $(this).blur(); });

	});
	
		$('body').on('click','#add_mail',function(){
		//alert("asdfz");

var str = $('.invite_email').val();
var strarray = str.split(/,|;/);
for (var i = 0; i < strarray.length; i++) {
//alert(strarray[i])

	 function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
	
	
      $check_form= $("#inviteSupp").valid();
     $check_form1= validateEmail(strarray[i]);
	
if($check_form){
if($check_form1){
        if(strarray[i]!=''){
            if(strarray[i]==$('#pec_loginID').val()){
                iziToast.error({
					timeout: 3000,
					id: 'error',
					title: 'Error',
					message: 'please enter valid email',
					position: 'topRight',
					transitionIn: 'fadeInDown'
				});
            }else{
            
            var email=strarray[i];
			//alert(email);
            var lot=$('#pmc1_id').val();
			$.ajax({
            type: "POST",
           // url: base_url+'/checkInvite',
            url: base_url+'/checkInvite_new',
            data: {
                email: email,
                lotid:lot,
               
            },
            dataType: 'JSON',
     
    
            success: function( res ) {
             msg=res.count;
             email=res.email;
            if(msg==0){
            
           // var email = strarray[i];
//alert(email);
            existval=$('#pei_invite_details1').val();
            
            var alreadyexist = 0;
            if(existval.length>0)
            {
                var result =existval.split(','); 
                var i=0;
          //var n = result.includes(email);
				var n = result.indexOf(email);
				
				
				if(n !== -1){
					alreadyexist = 0;
				}else{
					alreadyexist = 1;
				}

                /* if(n == true)
                {
                    alreadyexist = 0;
                }
                else
                {
                    alreadyexist = 1;
                }   */                 
            }
            else
            {
                alreadyexist = 1;
            }
             
            if(alreadyexist == 1)
            {
				
                $('.add_invite_email').append('<div class="alert-mail alert btn-light" role="alert" style="width:auto !important"> <a href="#" class="close" id="alert_close" data-dismiss="alert" aria-label="close">&times;</a> <span>'+email+'</span>   </button> </div>');
               
                $(".invite_emails").val(function() {
                    return this.value + email.toLowerCase()+',';
                });
            }
            else
            {
                iziToast.error({
					timeout: 3000,
					id: 'error',
					title: 'Error',
					message: 'Given email is already exist',
					position: 'topRight',
					transitionIn: 'fadeInDown'
				});
            }
            $("#pei_invite_details").val('');
                
            }
            else if(msg==2)
			{
				 iziToast.error({
					timeout: 3000,
					id: 'error',
					title: 'Error',
					message: 'This supplier is registered as Buyer',
					position: 'topRight',
					transitionIn: 'fadeInDown'
				});
            }
            else{
				iziToast.error({
					timeout: 3000,
					id: 'error',
					title: 'Error',
					message: 'This supplier has already been invited',
					position: 'topRight',
					transitionIn: 'fadeInDown'
				});
            }
        }
        });
    }

    }else{
		iziToast.error({
			timeout: 3000,
			id: 'error',
			title: 'Error',
			message: 'please enter valid email',
			position: 'topRight',
			transitionIn: 'fadeInDown'
		});
    }
      }
	  else{
		iziToast.error({
			timeout: 3000,
			id: 'error',
			title: 'Error',
			message: 'please enter valid email',
			position: 'topRight',
			transitionIn: 'fadeInDown'
		});
    }
      }
	}
	
	});		
	
	$('body').on('click','#alert_close',function(){
            var remove_email=$(this).next('span').html();
           // console.log(remove_email);
            var new_array=[];
            existval=$('#pei_invite_details1').val();
            if(existval.length>0){
                var result =existval.split(','); 
                var i=0;
                $.each(result, function(key, email) {
                    console.log(email)
                    if(email!=remove_email && email!=''){
                        
                        new_array.push(email.toLowerCase());
                    }
                   

                });
                if(new_array==','){
                    $('#pei_invite_details1').val('');
                }else{
                    $('#pei_invite_details1').val(new_array.join(',')+',');
                }
               // console.log(new_array.join('; '));
            }
            
         $(this).parrent.remove();
      
    });
    
    $('body').on('click','.skippopup,.btn-close',function(){
        $.ajax({
            type: "POST",
            url: base_url+'/skippopup',
            dataType: 'JSON',
    
            success: function( msg ) {
             //console.log(msg);
             $('#force_reset_password').modal('hide');
        
        }
        });
   });

   //gowtham
   $("#event_name_report").on("change", function() {

 
    var eventID = $(this).val();
    //var cat_type= $("#com_cat_type").val();
    $.ajax({
        type: "POST",
        url: base_url + "/getreportlot",
        data: {
            eventIDreport: eventID,
  
        },
        dataType: "JSON",
  
        success: function(e) {
              $('.preloader').hide();
              $("#sub_lot").empty();
              $("#sub_lot").append("<option value=''>-- Choose Your Lot --</option>")
              $.each(e, function(e, t) {
              $("#sub_lot ").append($("<option></option>").attr("value", t.pea_id).text(t.pea_event_spec))
            })
        }
    })
  });

  $("#event_report_validate").validate({
	rules: {
    // simple rule, converted to {required:true}
    event_name_report: {
    required: true
    },
    sub_lot: {
        required: true
        }

    }

});
    

    });
    
