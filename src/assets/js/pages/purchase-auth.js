
var base_url = window.location.origin;
$('.market-product').hide();
$('.market-service').hide();
$('.market-category').hide();
$('.category-subcategory').hide();

$( document ).ready(function() {
	  $('.numbers_only').keypress(function (e) {
			var regex = new RegExp("^[0-9]+$");
			var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
			if (regex.test(str)) {
				return true;
			}
			else
			{
			e.preventDefault();
			iziToast.error({
			timeout: 3000,
			id: 'error',
			title: 'Error',
			message: 'Numbers Only Allowed',
			position: 'topRight',
			transitionIn: 'fadeInDown'
		});
			}
		});

});

$( document ).ready(function() {

$.validator.addMethod('validUrl', function(value, element) {
	//alert("dsf");
        var url = $.validator.methods.url.bind(this);
        return url(value, element) || url('http://' + value, element);
    }, 'Please enter a valid URL');

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


$( document ).ready(function() {
	$('.letters_only').keypress(function (e) {
			var regex = new RegExp("^[a-zA-Z ]*$");
			var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
				
			if (regex.test(str)) {
				return true;
			}
			else
			{
			e.preventDefault();
			iziToast.error({
			timeout: 3000,
			id: 'error',
			title: 'Error',
			message: 'Albhabets Only Allowed',
			position: 'topRight',
			transitionIn: 'fadeInDown'
		});
			}
		});

});


$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
function emailChangeFunction(registerType)
{
  var email_id = $('#pli_loginid').val();

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_id))
  {
    $.ajax({
      type: "POST",
      url: base_url + "/checkEmailAvailability",
      data: { email_id: email_id, register_type: registerType },              
      dataType: "JSON",
      beforeSend: function(){
        $('.preloader').show();
      },
      success: function(msg) {
        
        $('.preloader').hide();

          if(msg['status'] == true)
          {    
            // iziToast.info({
            //   timeout: 3000,
            //   id: 'info',
            //   title: 'Info',
            //   message: msg['message'],
            //   position: 'bottomRight',
            //   transitionIn: 'bounceInLeft',            
            // });	   
          }
          else{		
            iziToast.error({
              timeout: 3000,
              id: 'error',
              title: 'Error',
              message: 'The email address you have entered is already registered.',
              position: 'topRight',
              transitionIn: 'fadeInDown'
            });                                    
          }
      }
    });
  }
}

function getSelectedOptions(sel) {
  var opts = [], opt;
  var values = [];
    
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      opts.push(opt);
      values.push(opt.value);
      //alert(opt.value);
    }
  }

  if(values != null){
      $.ajax({
        type: "POST",
        url: base_url + "/regmarketcategory",
        data: { array: values },              
        dataType: "JSON",
        beforeSend: function(){
          $('.preloader').show();
        },
        success: function(msg) {
          
          $('.preloader').hide();

            if(msg['status'] == true)
            {    
                $(".pci_comp_type_cat_desc").empty();
                //$(".pci_comp_type_cat_desc").append($("<option></option>").val().html('-- Choose the categories --')).select2();
                $.each(msg['data'], function (key, value) {
                $('.pci_comp_type_cat_desc').append($('<option>', { 
                    value: value.pmc_id,
                    text : value.pmc_cat_name 
                })).select2();
                
                  //alert(value.pmc_cat_name);
                  // $(".pci_comp_type_cat_desc").append($("<option></option>").val(value.pmc_id).html(value.pmc_cat_name));  
                });                
            }
            else{		
              $(".pci_comp_type_cat_desc").empty();                 
            }
        }
    });
  }else{
    $(".pci_comp_type_cat_desc").empty();
  }

  return opts;
}

function getSelectedSubcategory(sel) {
  var opts = [], opt;
  var values = [];
    
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      opts.push(opt);
      values.push(opt.value);
      //alert(opt.value);
    }
  }

  if(values != null){
      $.ajax({
        type: "POST",
        url: base_url + "/regcategorysubcategory",
        data: { array: values },              
        dataType: "JSON",
        beforeSend: function(){
          $('.preloader').show();
        },
        success: function(msg) {
          
          $('.preloader').hide();

            if(msg['status'] == true)
            {    
                $(".pci_comp_type_subcat_desc").empty();
                //$(".pci_comp_type_cat_desc").append($("<option></option>").val().html('-- Choose the categories --')).select2();
                $.each(msg['data'], function (key, value) {
                $('.pci_comp_type_subcat_desc').append($('<option>', { 
                    value: value.pms_id,
                    text : value.pms_subcat_name 
                })).select2();
                
                  //alert(value.pmc_cat_name);
                  // $(".pci_comp_type_cat_desc").append($("<option></option>").val(value.pmc_id).html(value.pmc_cat_name));  
                });                
            }
            else{		
              $(".pci_comp_type_subcat_desc").empty();                    
            }
        }
    });
  }else{
    $(".pci_comp_type_subcat_desc").empty();
  }

  return opts;
}

$(document).ready(function () {

   $('#comptype1').hide();

  $('#exampleInputPassword1').on("cut copy paste",function(e) {
    e.preventDefault();
  });

  // $("input[name='pli_con_desig']").keypress(function(event){
      // var inputValue = event.which;
      // // allow letters and whitespaces only.
      // if(!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) { 
          // event.preventDefault(); 
      // }
  // });

  // $("input[name='pli_con_name']").keypress(function(event){
    // var inputValue = event.which;
    // // allow letters and whitespaces only.
    // if(!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) { 
        // event.preventDefault(); 
    // }
	// });
	
	/* $("input[name='pli_con_desig']").keydown(function (e) {
		if (e.shiftKey || e.ctrlKey || e.altKey) {
			e.preventDefault();
		} else {
			var key = e.keyCode;
			if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
				e.preventDefault();
			}
		}
	  });

	  $("input[name='pli_con_name']").keydown(function (e) {
		if (e.shiftKey || e.ctrlKey || e.altKey) {
			e.preventDefault();
		} else {
			var key = e.keyCode;
			if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
				e.preventDefault();
			}
		}
	  });
 */

  var myWindow;		
  $('#branch_name').hide();
  $('#aap').hide(); 
  $('#toast_message_fail').hide(); 
  $('#toast_message_success').hide(); 
   
  $(".preloader").fadeOut()





 $("#buyer_register").validate({

  rules: {
    // simple rule, converted to {required:true}
    pci_comp_name: {
    required: true
    },
    pci_timezone: {
      required: true
      },
    // compound rule
    pci_comp_gst: { 
		required: true,
		maxlength: 15,
		minlength: 15
    },
    pci_country: {
      required: true,
    },
    pci_Tax_Id: {
      required: true,
      maxlength: 64,
    }, 
	pci_comp_location: {
      required: true,
	  maxlength: 100,
		minlength: 3
    },
    pci_comp_pan: {
		required: true,
		//maxlength: 10,
    minlength: 10,
    maxlength: 64
    },
	pci_comp_website: {
        validUrl: true, // <-- change this
	  maxlength: 250
    },
	pci_comp_type: {
		required: true
  },
  pci_comp_logo:{
    required:true
  },
    pci_comp_type: {
		required: true,
		maxlength: 100
    },
   /*  pci_comp_phone: {
		required: true,
		maxlength: 14,
		minlength: 10,
		number: true
    }, */
	pci_comp_type_cat:{
		required: true
	},
	pci_comp_nature_business: {
		required: true
	},
	pci_comp_establish_date:{
		required: true,
		date: true
	},
    pli_con_name: {
		required: true,
		maxlength: 50
    },
   /*  pli_con_mob: {
		required: true,
		maxlength: 10,
		minlength: 10,
		number: true
    }, */
    pli_loginid: {
		required: true,
		 maxlength: 250
    },
	pci_comp_address:{
		required: true
	},
    pli_con_desig: {
		required: true,
		maxlength: 100
    },
    accept_checkbox:{
		required: true
    }
    
    },
    messages:
    {
    pci_comp_type_cat:
    {
    required:"Please select a Category<br/>"
    },
    accept_checkbox: {
      required:"Kindly accept the terms and conditions<br/>"
    }
    },
    errorPlacement: function(error, element) 
    {
    if ( element.is(":radio") || element.is(":checkbox") ) 
    {
		if ( element.is(":radio")) 
		{
			error.appendTo( element.parents('.middle') );
		}
		else if( element.is(":checkbox") ) 
		{
			error.appendTo( element.parents('.custom-checkbox') );
		}    
    }
    else 
    { // This is the default behavior 
    error.insertAfter( element );
    }
    },


  submitHandler: function(form) {
  
  var formdate=$('#buyer_register').serializeArray();

          $.ajax({
              type: "POST",
              url: base_url+'/buyerRegister',
              data: formdate,
              dataType: 'JSON',
			  beforeSend: function(){
				$('.preloader').show();
			 },
              success: function( msg ) {
				//  
               //console.log(msg);
               if(msg['status']==true){

               // $("#status").html('<div class="alert alert-success"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Thanks for signing up for Purchase Quick. <br/> Please verify your email address."+'</div>');
               // $("#toast_message_success .alert").empty();
               // $("#toast_message_success .alert").append("Thanks for signing up for Purchase Quick. <br/> Please verify your email address");
               // $("#toast_message_success").show();
               $("#buyer-register-first").show();
            $("#buyer-register").trigger('reset');
			   iziToast.success({
					timeout: 3000,
					id: 'success',
					title: 'Success',
					message: 'Thanks for signing up for Purchase Quick. <br/> Please verify your email address',
					position: 'bottomRight',
					transitionIn: 'bounceInLeft',
					onOpened: function(instance, toast){
            
					},
					onClosed: function(instance, toast, closedBy){
            window.location = base_url;
					}
				});	   
			         
       
                }
                else{
                  $('.preloader').hide();
               // $("#status").html('<div class="alert alert-danger"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"The email address you have entered is already registered."+'</div>');
                // $("#toast_message_fail .alert").empty();
                // $("#toast_message_fail .alert").append("");
                // $("#toast_message_fail").show();
                $("#buyer-register-second").show();
                //$("#buyer-register").trigger('reset');
				
				iziToast.error({
					timeout: 3000,
					id: 'error',
					title: 'Error',
					message: 'The email address you have entered is already registered.',
					position: 'topRight',
					transitionIn: 'fadeInDown'
				});
              
              }
          
          }
          });

  }

});

$("#proxy_buyer_register").validate({

  rules: {
    // simple rule, converted to {required:true}
    pci_comp_name: {
    required: true
    },
    // compound rule
    pci_comp_gst: { 
		required: true,
		maxlength: 15,
		minlength: 15
    },
    pci_country: {
      required: true,
    },
    pci_Tax_Id: {
      required: true
    }, 
	pci_comp_location: {
      required: true,
	  maxlength: 100,
		minlength: 3
    },
    pci_comp_pan: {
		required: true,
		maxlength: 10,
		minlength: 10
    },
	pci_comp_website: {
        validUrl: true, // <-- change this
	  maxlength: 250
    },
	pci_comp_type: {
		required: true
  },
  pci_comp_logo:{
    required:true
  },
    pci_comp_type: {
		required: true,
		maxlength: 100
    },
   /*  pci_comp_phone: {
		required: true,
		maxlength: 14,
		minlength: 10,
		number: true
    }, */
	pci_comp_type_cat:{
		required: true
	},
	pci_comp_nature_business: {
		required: true
	},
	pci_comp_establish_date:{
		required: true,
		date: true
	},
    pli_con_name: {
		required: true,
		maxlength: 50
    },
   /*  pli_con_mob: {
		required: true,
		maxlength: 10,
		minlength: 10,
		number: true
    }, */
    pli_loginid: {
		required: true,
		 maxlength: 250
    },
	pci_comp_address:{
		required: true
	},
    pli_con_desig: {
		required: true,
		maxlength: 100
    },
    accept_checkbox:{
		required: true
    }
    
    },
    messages:
    {
    pci_comp_type_cat:
    {
    required:"Please select a Category<br/>"
    },
    accept_checkbox: {
      required:"Kindly accept the terms and conditions<br/>"
    }
    },
    errorPlacement: function(error, element) 
    {
    if ( element.is(":radio") || element.is(":checkbox") ) 
    {
		if ( element.is(":radio")) 
		{
			error.appendTo( element.parents('.middle') );
		}
		else if( element.is(":checkbox") ) 
		{
			error.appendTo( element.parents('.custom-checkbox') );
		}    
    }
    else 
    { // This is the default behavior 
    error.insertAfter( element );
    }
    },


  submitHandler: function(form) {
  
  var formdate=$('#proxy_buyer_register').serializeArray();

          $.ajax({
              type: "POST",
              url: base_url+'/proxyBuyerRegister',
              data: formdate,
              dataType: 'JSON',
			  beforeSend: function(){
				$('.preloader').show();
			 },
              success: function( msg ) {
				//  
               //console.log(msg);
               if(msg['status']==true){

               // $("#status").html('<div class="alert alert-success"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Thanks for signing up for Purchase Quick. <br/> Please verify your email address."+'</div>');
               // $("#toast_message_success .alert").empty();
               // $("#toast_message_success .alert").append("Thanks for signing up for Purchase Quick. <br/> Please verify your email address");
               // $("#toast_message_success").show();
               $("#buyer-register-first").show();
            $("#buyer-register").trigger('reset');
			   iziToast.success({
					timeout: 3000,
					id: 'success',
					title: 'Success',
					message: 'Profile Created Successfully',
					position: 'bottomRight',
					transitionIn: 'bounceInLeft',
					onOpened: function(instance, toast){
            
					},
					onClosed: function(instance, toast, closedBy){
            window.location = base_url+'/list-profile';
					}
				});	   
			         
       
                }
                else{
                  $('.preloader').hide();
               // $("#status").html('<div class="alert alert-danger"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"The email address you have entered is already registered."+'</div>');
                // $("#toast_message_fail .alert").empty();
                // $("#toast_message_fail .alert").append("");
                // $("#toast_message_fail").show();
                $("#buyer-register-second").show();
                //$("#buyer-register").trigger('reset');
				
				iziToast.error({
					timeout: 3000,
					id: 'error',
					title: 'Error',
					message: 'The email address you have entered is already registered.',
					position: 'topRight',
					transitionIn: 'fadeInDown'
				});
              
              }
          
          }
          });

  }

});

//seller registered

$("#seller_register").validate({

  rules: {
    // simple rule, converted to {required:true}
    pci_comp_name: {
    required: true
    },
    pci_timezone: {
      required: true
      },
    // compound rule
    pci_comp_gst: { 
		required: true,
		maxlength: 15,
		minlength: 15
    },
    pci_country: {
      required: true,
    },
    pci_Tax_Id: {
      required: true,
      maxlength: 64,
    },
    pci_comp_pan: {
		required: true,
  //	maxlength: 10,
  maxlength: 64,
		minlength: 10
    },
	pci_comp_type: {
		required: true,
		maxlength: 100
	},
	pci_comp_website: {
       validUrl: true, // <-- change this
	  maxlength: 250
    },
    pci_comp_type: {
		required: true,
		required: true,
		maxlength: 100
		
    },
	pci_comp_type_market_desc: {
      required: true
    },
    pci_comp_type_cat_desc:{
      required: true,
    },    
    pci_comp_type_subcat_desc: {
      required: true
    },
    pci_comp_phone: {
		required: true,
		maxlength: 15,
		minlength: 10,
		number: true
    },
	pci_comp_type_cat:{
		required: true
	},
	pci_comp_location: {
      required: true,
	  maxlength: 100,
		minlength: 3
    },
	pci_comp_nature_business: {
		required: true
	},
	pci_comp_establish_date:{
		required: true,
		date: true
	},
    pli_con_name: {
		required: true,
		maxlength: 50
    },
    pli_con_mob: {
		required: true,
		maxlength: 15,
		minlength: 10,
		number: true
    },
    pli_loginid: {
		required: true,
		maxlength: 250
    },
	pci_comp_address:{
		required: true
	},
    pli_con_desig: {
		required: true,
		maxlength: 100
    },
    customControlInline:{
		required: true
    },
    pci_comp_autorized_type:
    {
      required: true
    },
    accept_checkbox:{
		required: true
    }
    
    
    },
    messages:
    {
    pci_comp_type_cat:
    {
    required:"Please select a Category<br/>"
    },
    pci_comp_type_cat_desc:
    {
    required:"Please select a Category<br/>"
    },
    accept_checkbox: {
      required:"Kindly accept the terms and conditions <br/>"
    }
    },
    errorPlacement: function(error, element) 
    {
    if ( element.is(":radio") || element.is(":checkbox") ) 
    {
		if ( element.is(":radio")) 
		{
			error.appendTo( element.parents('.middle') );
		}
		else if( element.is(":checkbox") ) 
		{
			error.appendTo( element.parents('.custom-checkbox') );
		}    
    }
    else 
    { // This is the default behavior 
    error.insertAfter( element );
    }
    },


  submitHandler: function(form) {
	  
	if($('.pci_comp_type_market_desc').val()==''){
      $('.market_error').show();
      return;
    }

    if($('.pci_comp_type_cat_desc').val()==''){
      $('.market_error').hide();
      $('.category_error').show();
      return;
    }
   
    if($('.pci_comp_type_subcat_desc').val()==''){
      $('.market_error').hide();
      $('.category_error').hide();
      $('.sub_category_error').show();    
    }else{
  
      $('.market_error').hide();
      $('.sub_category_error').hide();
      $('.category_error').hide();
	  
  var formdate=$('#seller_register').serializeArray();

        // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/sellerRegister',
              data: formdate,
              dataType: 'JSON',
			  beforeSend: function(){
				$('.preloader').show();
			 },
              success: function( msg ) {
               //console.log(msg);
			 //  $('.preloader').hide();
               if(msg['status']==true){
               // $("#status").html('<div class="alert alert-success"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Thanks for signing up for Purchase Quick. <br/> Please verify your email address."+'</div>');
               // $("#toast_message_success .alert").empty();
               // $("#toast_message_success .alert").append("Thanks for signing up for Purchase Quick. <br/> Please verify your email address");
               // $("#toast_message_success").show();

               $("#seller-register-first").show();
               $("#seller-register").trigger('reset');
			   
			   iziToast.success({
					timeout: 3000,
					id: 'success',
					title: 'Success',
					message: 'Thanks for signing up for Purchase Quick. <br/> Please verify your email address',
					position: 'bottomRight',
					transitionIn: 'bounceInLeft',
					onOpened: function(instance, toast){
           
					},
					onClosed: function(instance, toast, closedBy){
            window.location = base_url;
					}
				});	
        
      
                }
                else{
                  $('.preloader').hide();
               // $("#status").html('<div class="alert alert-danger"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"The email address you have entered is already registered."+'</div>');
                 // $("#toast_message_fail .alert").empty();
                // $("#toast_message_fail .alert").append("The email address you have entered is already registered");
                // $("#toast_message_fail").show();
              
                $("#seller-register-second").show();
                $("#seller-register-first").show();
				iziToast.error({
					timeout: 3000,
					id: 'error',
					title: 'Error',
					message: 'The email address you have entered is already registered.',
					position: 'topRight',
					transitionIn: 'fadeInDown'
				});
              
              }
          
          }
          });

  }
  }
});



$('input[type=radio][name=pci_comp_type_cat]').change(function() {
  if (this.value == 1) {
    //$('.pci_comp_type_cat_desc1').select2('val',0);
	
	$('.pci_comp_type_cat_desc').empty();
    $('.pci_comp_type_market_desc').select2('val',0);
    $('.pci_comp_type_subcat_desc ').empty();
     
  }
  else if (this.value == 2) {
    //$('.select2-multiple').select2('val',0);
	
	$('.pci_comp_type_cat_desc').empty();
    $('.pci_comp_type_market_desc').select2('val',0);
    $('.pci_comp_type_subcat_desc ').empty();
  }
});
//login 



	

 $('.gst_no').keyup(function() 
	{
    var address="";
    var model_address="";
    var branch_address;
    var html_append=[]; 
		if (!event.ctrlKey) {
      /* here your code for all keys besides CTRL ;-) */
     var gst = $(this).val();
     var gst_key = $('#gst_access').val();

        if(gst.length == 15)
        {
          $.ajax({
                  type: "POST",
                  url: base_url+'/companyDetails',
                  data: { gst : gst, token : gst_key },
                  dataType: 'JSON',
                  beforeSend: function(){
                    $('.preloader').show();
					iziToast.info({
						timeout: 50000,
						id: 'info',
						title: 'INFO',
						message: 'Waiting For GST Response',
						position: 'bottomRight',
						transitionIn: 'bounceInLeft'
						
					});
                   },
                  success: function( msg ) {
                    iziToast.destroy();
            if(msg.error==false){
              //console.log(msg.data.ctb);
             $('.gst_error').hide();
              var unino = gst;

              var pan = unino.substr(2, 10);
              $('input[name="pci_comp_pan"]').val(pan);
              $('input[name="pci_comp_pan"]').prop("readonly", true);
  
                    var permanent_addr=msg.data;
                   

                      if(permanent_addr.pradr.addr.bnm!='')
                      address+= permanent_addr.pradr.addr.bnm;
                      if(permanent_addr.pradr.addr.bno!='')
                      address+=', '+permanent_addr.pradr.addr.bno;
                      if(permanent_addr.pradr.addr.city!='')
                      address+= ', '+permanent_addr.pradr.addr.city;
                      if(permanent_addr.pradr.addr.dst!='')
                      address+= ', '+permanent_addr.pradr.addr.dst;
                      if(permanent_addr.pradr.addr.flno!='')
                      address+= ', '+permanent_addr.pradr.addr.flno;
                      if(permanent_addr.pradr.addr.lg!='')
                      address+= ', '+permanent_addr.pradr.addr.lg;
                      if(permanent_addr.pradr.addr.loc!='')
                      address+= ', '+permanent_addr.pradr.addr.loc;
                      if(permanent_addr.pradr.addr.lt!='')
                      address+= ', '+permanent_addr.pradr.addr.lt;
                      if(permanent_addr.pradr.addr.pncd!='')
                      address+= ', '+permanent_addr.pradr.addr.pncd;
                      if(permanent_addr.pradr.addr.st!='')
                      address+= ', '+permanent_addr.pradr.addr.st;
                      if(permanent_addr.pradr.addr.stcd!='')
                      address+= ', '+permanent_addr.pradr.addr.stcd;
                 
                      var edited_pradr = address.replace(/^,|,$/g,'');


                    if(permanent_addr.adadr.length!=0)
                    {

                     $('#branch_name').show();
                    $.each( permanent_addr.adadr, function( index, value ){
                      branch_address="";
                      
                      if(value.addr.bnm!='')
                      branch_address+= value.addr.bnm;
                      if(value.addr.bno!='')
                      branch_address+=', '+value.addr.bno;
                      if(value.addr.city!='')
                      branch_address+= ', '+value.addr.city;
                      if(value.addr.dst!='')
                      branch_address+= ', '+value.addr.dst;
                      if(value.addr.flno!='')
                      branch_address+= ', '+value.addr.flno;
                      if(value.addr.lg!='')
                      branch_address+= ', '+value.addr.lg;
                      if(value.addr.loc!='')
                      branch_address+= ', '+value.addr.loc;
                      if(value.addr.lt!='')
                      branch_address+= ', '+value.addr.lt;
                      if(value.addr.pncd!='')
                      branch_address+= ', '+value.addr.pncd;
                      if(value.addr.st!='')
                      branch_address+= ', '+value.addr.st;
                      if(value.addr.stcd!='')
                      branch_address+= ', '+value.addr.stcd;
                      html_append[index]=branch_address;
                  });

                  $.each( html_append, function( index, value ){
					 
                    var edited = value.replace(/^,|,$/g,'');
                    model_address+='<div class="no_of_speakers_radio_button">';
                    model_address+='<label class="four_speakers">';
                    model_address+=  '<input type="radio" id="choose_addr" name="choose_speaker" class="click">';
                    model_address+=  '<span class="font_size_17">'+edited+'</span>';
                    model_address+=  '</label>';
                    model_address+= '</div>';
                  });
				  
					
                }
                  // console.log(permanent_addr.pradr.addr.dst);
                  $('input[name="pci_comp_nature_business"]').val(permanent_addr.nba);
                  $('input[name="pci_comp_nature_business"]').prop("readonly", true);

                    $('#pci_comp_name').val(permanent_addr.lgnm);
                    $('#pci_comp_name').prop("readonly", true);

                    $('input[name="pci_comp_establish_date"]').val(permanent_addr.rgdt);
                    $('input[name="pci_comp_establish_date"]').prop("readonly", true);

                    //$('input[name="pci_comp_type"]').val(permanent_addr.ctb);


                    if( permanent_addr.ctb != null)
                    {
                        $('#pci_comp_type1').show();
                        $('#comptype1').hide();
                        //$('input[name="pci_comp_type"]').val(permanent_addr.ctb).prop("readonly", true);
                             $('input[name="pci_comp_type"]').val(permanent_addr.ctb);
                    }
                    else
                    {
                            $('#comptype1').show();
                            $('#pci_comp_type1').hide();
                    }






                  //  $('input[name="pci_comp_type"]').prop("readonly", true);

                    $('textarea[name="pci_comp_address"]').val(edited_pradr);
                    $('textarea[name="pci_comp_address"]').prop("readonly", true);

                    if(permanent_addr.pradr.addr.dst!='')
                    $('input[name="pci_comp_location"]').val(permanent_addr.pradr.addr.dst);
                    else
                    $('input[name="pci_comp_location"]').val(permanent_addr.pradr.addr.city);
                    $('#gst_data_receive').find('.modal-body').empty();
                    $('#gst_data_receive').find('.modal-body').append(model_address);
                    //$("#pci_comp_type option[value="+permanent_addr.ctb+"]").prop("selected",true);
                   // $('#gst_data_receive').find('.modal-body').append('<p>'+model_address+'</p>');
              
					$('.preloader').hide();
                 /* if(msg['status']==true){
                    $("#status").html('<div class="alert alert-success"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Thanks for signing up for Purchase Quick. <br/> Please verify your email address."+'</div>');
					$('form').trigger("reset");
                    }
                    else{
                    $("#status").html('<div class="alert alert-danger"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"The email address you have entered is already registered."+'</div>');
                    }*/
              
              }else{
                $('.preloader').hide();
             
                 $('form').trigger('reset');
                 $('.gst_error').show();

                 $('input[name="pci_comp_nature_business"]').prop("readonly", false);
                 $('#pci_comp_name').prop("readonly", false);
                 $('input[name="pci_comp_establish_date"]').prop("readonly", false);
                 $('input[name="pci_comp_type"]').prop("readonly", false);
                 $('textarea[name="pci_comp_address"]').prop("readonly", false);
                 $('input[name="pci_comp_pan"]').prop("readonly", false);
              
                  iziToast.error({
                    timeout: 3000,
                    id: 'error',
                    title: 'Error',
                    message: 'Invalid GSTIN',
                    position: 'topRight',
                    transitionIn: 'fadeInDown'
                  });
              }
            }
              });
        
        }
		else{
			 if(gst.length == 0){
			$('#buyer_register').trigger("reset");
			$('#seller_register').trigger("reset");
		}
		}
      }

    
	  
    });


    $('body').on('click','#choose_addr',function(){
    $choose_address=($(this).next('span').html());
    $('textarea[name="pci_comp_address"]').val($choose_address);
      //$('#communication_checkbox').removeAttr('checked');
    $("#communication_checkbox").prop("checked", false); //added by sreene
		$('textarea[name="pci_comp_billing_address"]').val(null);	//added by sreene
		$('#gst_data_receive').modal('hide');

   });

   $("#resend_link").validate({

    rules: {
      // simple rule, converted to {required:true}
      pq_email: {
        required: true,
        email:true
      }
  
  },
  
  submitHandler: function(form) {
  
  var formdate=$('#resend_link').serializeArray();
  
        // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/resendlink',
              data: formdate,
              dataType: 'JSON',
			  beforeSend: function(){
                    $('.preloader').show();
               },
              success: function( msg ) {				
                $('.preloader').hide();
                if(msg['status']==true)
                {
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

   $("#forgot_password").validate({

    rules: {
      // simple rule, converted to {required:true}
      pq_email: {
        required: true,
        email:true
      }
  
  },
  
  submitHandler: function(form) {
  
  var formdate=$('#forgot_password').serializeArray();
  
        // return false;
          $.ajax({
              type: "POST",
              url: base_url+'/forgot',
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
						message: 'Check your email for password Details.',
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
						message: 'Invalid Details.',
						position: 'topRight',
						transitionIn: 'fadeInDown'
					});
				  }
			}
          });
  
  }
  
  });
  
  
  $("#password_reset").validate({

    rules: {
      // simple rule, converted to {required:true}
      password: {
        required: true
      },
	  confirm_password: {
		  equalTo: "#exampleInputPassword"
	  }
  
  },
  
  submitHandler: function(form) {

    var formdate = $('#exampleInputPassword').val();  
	var url 	 =  window.location.pathname.split('/');
          $.ajax({
              type: "POST",
              url: base_url+'/restpass',
              data: {'password':formdate,'url':url[2]},
              dataType: 'JSON',
			  beforeSend: function(){
				$('.preloader').show();
			  },
              success: function( msg ) {				
                    
				  if(msg['status']==true)
				  {
					$('.preloader').hide();
					//$('#aap').show(); 
					iziToast.success({
						timeout: 3000,
						id: 'success',
						title: 'Success',
						message: 'Password Changed Successfully',
						position: 'bottomRight',
						transitionIn: 'bounceInLeft',
						onOpened: function(instance, toast){
              window.location.href	=	base_url; 
						},
						onClosed: function(instance, toast, closedBy){
							console.info('closedBy: ' + closedBy);
						}
					});
					
					//window.location = base_url;
				 
				  }
				  else{
					 $('.preloader').hide();
					//$("#status").html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Invalid Details."+'</div>');
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


  $(".reset-password").keyup(function(event){
      $('#result').html(checkStrength($('.reset-password').val()))
  });


  function checkStrength(password) {
    var strength = 0
    if (password.length < 6) {
    $('#result').removeClass()
    $('#result').addClass('short')
    $('#result').css('color', 'orange')
    $('#resultNote').html('Kindly include special character and number in your password');
    $('.reset-password-submit').prop('disabled', true);
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
    $('.reset-password-submit').prop('disabled', true);
    return 'Weak'
    } else if (strength == 2) {
    $('#result').removeClass()
    $('#result').addClass('good')
    $('#result').css('color', 'blue')
    $('#resultNote').html('');
    $('.reset-password-submit').prop('disabled', false);
    return 'Good'
    } else {
    $('#result').removeClass()
    $('#result').addClass('strong')
    $('#result').css('color', 'green')
    $('#resultNote').html('');
    $('.reset-password-submit').prop('disabled', false);
    return 'Strong'
    }
}
  
  $("#clarification_form").validate({
	
    rules: {
      // simple rule, converted to {required:true}
      clarification: {
              required: true
          }    
      },
  
    submitHandler: function(form) {
    
    var formdate = $('#clarification_form').serializeArray();
    
    //console.log(formdate);
      
         // return false;
            $.ajax({
                type: "POST",
                url: base_url+'/needclarification',
                data: formdate,
                dataType: 'JSON',
                beforeSend: function(){
                    $('.preloader').show();
                },
                success: function( msg ) {
                 //console.log(msg);
                 if(msg['status']==true){
                  $('.preloader').hide();
                  // $("#appendtext").empty();
                  // $("#appendtext").append("Thanks For your feedback, Buyer get back you soon");
                  // $("#toast_message_success").show();
				  iziToast.success({
						timeout: 3000,
						id: 'success',
						title: 'Success',
						message: 'Thanks For your feedback, Buyer get back you soon',
						position: 'bottomRight',
						transitionIn: 'bounceInLeft',
						onOpened: function(instance, toast){
              window.close();
						},
						onClosed: function(instance, toast, closedBy){
							console.info('closedBy: ' + closedBy);
						}
					});
                  }
                  else{
                     
                      $('.preloader').hide();
                      // $("#appendtext").empty();
                      // $("#appendtext").append("Failed! Try Again later");
                      // $("#toast_message_fail").show();
					  iziToast.error({
							timeout: 3000,
							id: 'error',
							title: 'Error',
							message: 'Try Again later',
							position: 'topRight',
							transitionIn: 'fadeInDown'
						});
                  //$("#status").html('<div class="alert-mail alert alert-danger"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Please Enter Any your email address."+'</div>');
                  //$('.inviteSu').hide();
                  //$('.success_val').show(); 
                  }
            
            }
            });
  
    }
  
  });

$("#buyerLogin").validate({

  rules: {
    // simple rule, converted to {required:true}
    email: {
      required: true,
      email:true
    },
    // compound rule
    password: {
     
      required: true,

    }

},

submitHandler: function(form) {

var formdate=$('#buyerLogin').serializeArray();
//alert(formdate);
      // return false;
        $.ajax({
            type: "POST",
            url: base_url+'/buyerLogin',
            data: formdate,
            dataType: 'JSON',
            success: function( msg ) {				
            
			 if(msg['login_type'] == "1" || msg['login_type'] == "3" || msg['login_type'] == "4")
			 {
				if(msg['status']==true)
				{
          //myWindow = window.open(base_url+'/event', "myWindow", "width=1200, height=500");
					window.location = '/event';
				}
				else{
					iziToast.error({
							timeout: 3000,
							id: 'error',
							title: 'Error',
							message: 'Invalid Details.',
							position: 'topRight',
							transitionIn: 'fadeInDown'
						});
					//$("#status").html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+"Invalid Details."+'</div>');			

						// iziToast.error({
						// 	timeout: 3000,
						// 	id: 'error',
						// 	title: 'Error',
						// 	message: 'Invalid Details.',
						// 	position: 'topRight',
						// 	transitionIn: 'fadeInDown'
						// });
				}
			 }
			 else{
				 if(msg['status']==true)
				{
          window.location = '/live-auction';
          //myWindow = window.open(base_url+'/live-auction', "myWindow", "width=1200, height=500");
				}
				else{

          if(msg['c_code']==3)
		  {
			iziToast.error({
				timeout: 3000,
				id: 'error',
				title: 'Error',
				message: 'Please check your email and activate your account',
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
				message: msg['message'],
				position: 'topRight',
				transitionIn: 'fadeInDown'
			});		 
							
		 }
				}
			 }
			}
        });

}

});


   $(".select2-multiple" ).select2( {
		placeholder: "-- Choose Your options --",
		width: null,
		containerCssClass: ':all:'
	} );
	
			
    $('#isoyes').click(function () {
        $('#iso-certificate').show('fast');
    });
	  $('#isono').click(function () {
        $('#iso-certificate').hide('fast');
    });
    $('#msimyes').click(function () {
        $('#msim-certificate').show('fast');
    });
	$('#msimno').click(function () {
        $('#msim-certificate').hide('fast');
    });
	$('#othersyes').click(function () {
        $('#others-certificate').show('fast');
    });
	$('#othersno').click(function () {
        $('#others-certificate').hide('fast');
    });
    
    $("#communication_checkbox").on('change',function()
    {//alert($('#pci_comp_address').val());
      if(!$(this).is(':checked'))
      $('#pci_comp_billing_address').val('');
      else
      $('#pci_comp_billing_address').val($('#pci_comp_address').val());
       
    });


  
	$('input[name="pci_comp_type_cat"]').click(function(){
        var inputValue = $(this).attr("value");
		if(inputValue == 1)
		{
			//$('.cat-product').show();
			//$('.cat-service').hide();
			
			$('.market-product').show();
			$('.market-service').hide();
			$('.market-product .pci_comp_type_market_desc').select2('val',0);
			$('.market-service .pci_comp_type_market_desc').select2('val',0);
			  
			$('.market-category').show();
			$('.category-subcategory').show();
		}
		else{
			//$('.cat-product').hide();
			//$('.cat-service').show();
			
			$('.market-product').hide();
			$('.market-service').show();
			$('.market-product .pci_comp_type_market_desc').select2('val',0);
			$('.market-service .pci_comp_type_market_desc').select2('val',0);
      
			$('.market-category').show();
			$('.category-subcategory').show();
		}
       
    });


 });

// ajax model change