export function humanizeDate(datetime: string): string {

  const date = new Date(datetime);
  const now = Date.now();
  const delta = Math.round((now - date.getTime()) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = week * 4;
  const year = month * 12;
  
  if(delta < 30){
    return "just now"
  }
  
  if(delta < minute){
    return delta + ' seconds ago';
  }
  
  if(delta < hour){
    const number = Math.floor(delta / minute);
    
    if(number == 1){
      return '1 minute ago';
    }

    return number + ' minutes ago';
  }
  
  if(delta < day){
    const number = Math.floor(delta / minute);

    if(number == 1){
      return '1 hour ago';
    }

    return number + ' hours ago';
  }
  
  if(delta < week){
    const number = Math.floor(delta / minute);

    if(number == 1){
      return '1 day ago';
    }

    return Math.floor(delta / day) + ' days ago';
  }
  
  if(delta < month){
    const number = Math.floor(delta / minute);

    if(number == 1){
      return '1 week ago';
    }

    return Math.floor(delta / week) + ' weeks ago';
  }
  
  if(delta < year){
    const number = Math.floor(delta / minute);

    if(number == 1){
      return '1 month ago';
    }

    return Math.floor(delta / month ) + ' months ago';
  }
  
  return Math.floor(delta / year) + ' years ago';
}
