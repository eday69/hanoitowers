//variable for storing the dragging item reference
//this will avoid the need to define any transfer data
//which means that the elements don't need to have IDs
var item = null;
var level = 1;
var maxlevel=11;

// Function to create and add the 'disks' for the level.
// Each disk is a disk

function addDisks(level) {
  // Game starts @ tower 1, so we add all disks to tower 1
  var pos = document.getElementById('tower1');
  for (var i=level; i>0; i--) {
    var mynewdiv=document.createElement('div');
    mynewdiv.className='disk';
    mynewdiv.innerHTML=i;
    mynewdiv.id='disk'+(i);
    mynewdiv.style.setProperty('width', 50+(i*10) + 'px');
    pos.appendChild(mynewdiv);
  }
  // To last div we will apply class diskmove which will allow user to seelct and drag
  // but only to last one.
  mynewdiv.className='disk diskmove';
  mynewdiv.draggable = true;
}

 document.addEventListener('DOMContentLoaded',function(){
   // addDisks(level);
   var mylevel = document.getElementById('selectlevel');
   for(i=1; i<=maxlevel; i++) {
     mylevel.options[i] = new Option(i);
   }
 });

// According to user selection of level, create that number of
// disks and start gaming !
function runLevel() {
  var mylevel = document.getElementById('selectlevel');
  level = mylevel.options[mylevel.selectedIndex].value;

  if (level > 1) {
    var mylevel = document.getElementById('level_select');
    // pos.style.visibility = 'visible';
    mylevel.style.display = 'none';
    addDisks(level);
  }
}

// Finished game and user pressed the 'Another?' button,
// So we hide the 'winner' div, and show the 'select level' div
// but we need to clear some stuff, like remove the 'disks' that
// were already used, reset score, etc !

function askLevel(){
  //empty divs !!
  var towerdivs = document.getElementById('tower3');
  while (towerdivs.hasChildNodes()) {
    towerdivs.removeChild(towerdivs.lastChild);
  }
  var score = document.getElementById('score');
  score.innerHTML = 0;
  while (towerdivs.hasChildNodes()) {
    towerdivs.removeChild(towerdivs.lastChild);
  }
  var mylevel = document.getElementById('level_select');
  mylevel.style.display = 'block';

  var mylevel = document.getElementById('winner');
  mylevel.style.display = 'none';

}
//dragstart event to initiate mouse dragging
document.addEventListener('dragstart', function(e)
{
    //set the item reference to this element
    item = e.target;

    //we don't need the transfer data, but we have to define something
    //otherwise the drop action won't work at all in firefox
    //most browsers support the proper mime-type syntax, eg. "text/plain"
    //but we have to use this incorrect syntax for the benefit of IE10+
    // e.dataTransfer.setData('text', '');

}, false);

//dragover event to allow the drag by preventing its default
//ie. the default action of an element is not to allow dragging
document.addEventListener('dragover', function(e)
{
    if(item)
    {
        e.preventDefault();
    }

}, false);

//drop event to allow the element to be dropped into valid targets
document.addEventListener('drop', function(e)
{
    //if this element is a drop target, move the item here
    //then prevent default to allow the action (same as dragover)
    if(e.target.getAttribute('data-draggable') == 'target')
    {
        parent=item.parentElement;
        // Add to score if we did move disk to another pole.
        var score = document.getElementById('score');
        if (e.target != parent) {
          score.innerHTML = parseInt(score.innerHTML) + 1;
        }
        // No need to change class in draggable item, since it could be moved again

        // Target div has children.
        // Need to make current child, before drop, not draggable
        // and change his class for proper visual effects.
        if (e.target.lastChild) {
          lst_child_width = parseInt(e.target.lastChild.style.width,10);
          my_width = parseInt(item.style.width,10);
          // console.log('In: ',parseInt(item.style.width,10), parseInt(e.target.lastChild.style.width,10));
          if (my_width < lst_child_width) {
            e.target.lastChild.draggable = false;
            e.target.lastChild.className='disk';
            e.target.appendChild(item);
            e.preventDefault();
          }
        }
        else {
          // Target div has NO children, just append into div.
          e.target.appendChild(item);
          e.preventDefault();
        }
        // If source div had children, we need to change class of
        // the, now top, child and make it draggable too.
        if (parent.lastChild) {
          // console.log('New last child: '+parent.lastChild.id);
          parent.lastChild.draggable = true;
          parent.lastChild.className='disk diskmove';
        }
    }
}, false);

//dragend event to clean-up after drop or abort
//which fires whether or not the drop target was valid
document.addEventListener('dragend', function(e)
{
  if (item.parentElement.id == 'tower3') {
    if (item.parentElement.childElementCount == level) {
      var pos = document.getElementById('winner');
      // pos.style.visibility = 'visible';
      pos.style.display = 'block';
      // pos.innerHTML = '<div class="winner_text"><p>You Won !!!</p><br><p>Thank you for playing.</p></div>';
      // alert('You won !!! ');
    }
  }
    item = null;
}, false);
