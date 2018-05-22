window.addEventListener('load', (e) => {
  var dayEvents = [
    {start: 30,  end: 130, label: 'a'},
    {start: 140,  end: 200, label: 'b'},
    {start: 300,  end: 500, label: 'c'},
    {start: 330,  end: 400, label: 'd'},
    {start: 410,  end: 420, label: 'e'},
    {start: 1130, end: 1200, label: 'f1'},
    {start: 1145, end: 1215, label: 'f2'},
    {start: 1155, end: 1230, label: 'f3'},
    {start: 820,  end: 830, label: 'g'},
    {start: 950,  end: 1020, label: 'h'},
    {start: 950,  end: 1020, label: 'i'},
    {start: 1500,  end: 1600, label: 'j'}
  ];

  new Calendar().display(dayEvents);
});

function Calendar() {
  this.DAY_HEIGHT = 600;
  this.HOUR_HEIGHT = 24;
}

Calendar.prototype.display = function(events) {
  // Sort event by start time
  events.sort((a, b) => a.start-b.start);

  let overlappingEvents = [];
  for (let e of events) {
    let top = this.timeToPixels(e.start),
        bottom = this.timeToPixels(e.end),
        currentEvent = {top: top, bottom: bottom, label: e.label},
        overlaps = overlappingEvents.length && this.overlaps(currentEvent, overlappingEvents);

    if (!overlaps) {
      this.appendEl(overlappingEvents);
      overlappingEvents = [];
    }

    overlappingEvents.push(currentEvent);
  };
};

Calendar.prototype.appendEl = function(events) {
  let calDiv = document.querySelector('#cal-currentday');

  for (let i = 0; i < events.length; i++) {
    let e = events[i],
        eventDiv = document.createElement('div');

    eventDiv.className = 'cal-event';
    eventDiv.style.top = e.top;
    eventDiv.style.height = e.bottom - e.top;
    if (i > 0) {
      let shift = 20 * i;
      for (var j = i - 1; j >= 0; j--) {
        if (!this.overlaps(e, [events[j]])) {
          shift = 20 * j;
        }
      }
      eventDiv.style.left = shift;
    }
    eventDiv.innerText = e.label;
    calDiv.appendChild(eventDiv);
  }
};

Calendar.prototype.timeToPixels = function(dayTime) {
  let hours = Math.floor(dayTime / 100),
      minutes = dayTime % 100,
      pxHours = hours * this.DAY_HEIGHT / 24,
      pxMinutes = minutes * this.HOUR_HEIGHT / 60;
  return pxHours + pxMinutes;
};

Calendar.prototype.overlaps = function(currentEvent, previousEvents) {
  function overlapsWithOther(ev1, ev2) {
    if (ev1.top == ev2.top) {
      return true;
    }
    if (ev1.top < ev2.top) {
      return ev1.bottom < ev2.top;
    }
    return ev2.bottom > ev1.top;
  }

  for (let prev of previousEvents) {
    if (overlapsWithOther(currentEvent, prev)) {
      return true;
    }
  }
  return false;
};
