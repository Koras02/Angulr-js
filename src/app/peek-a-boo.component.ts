// tslint:disable: no-conflicting-lifecycle
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked, 
  AfterViewInit,
  Directive,
  DoCheck,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Component, Input } from '@angular/core';
import { LoggerService } from './logger.service';

let nextId = 1;

@Directive()
export class PeekABooDirective implements OnInit {
  constructor(private logger: LoggerService) { }
  
  // OnInit 인터페이스에서 정의하는 `ngOnInit` 메소드를 구현합니다.
  ngOnInit() { this.logIt(`OnInit`); }

  logIt(msg: string) {
    this.logger.log(`#${nextId++} ${msg}`);
  }
}

@Component({
  selector: 'peek-a-boo',
  template: '<p>Now you see my hero, {{name}}</p>',
  styles: ['p {background: LightYellow; padding: 8px}']
})
// Don't HAVE to mentio the Lifecycle Hook interfaces 
// unless we want typing and tool support.
export class PeekABooComponent extends PeekABooDirective implements 
             OnChanges, OnInit, DoCheck,
             AfterContentInit, AfterContentChecked,
             AfterViewInit, AfterViewChecked,
             OnDestroy {
   @Input() name: string;
   
   private verb = 'initialized';

   constructor(logger: LoggerService) {
     super(logger);
     
     const is = this.name ? 'is' : 'is not';
     this.logIt(`name ${is} known at construction`);
   }

   // only called for/if there is an @input variable set by parent. 
   ngOnChanges(changes: SimpleChanges) {
     const changesMsgs: string[] = []; 
     for (const propName in changes) {
       if (propName === 'name') {
         const name = changes.name.currentValue;
         changesMsgs.push(`name ${this.verb} to "${name}"`);
       } else {
         changesMsgs.push(propName + ' ' + this.verb);
       }
     }
     this.logIt(`OnChanges: ${changesMsgs.join('; ')}`);
     this.verb = 'changed'; // next time it will be a change 
    } 
   
    // Beware! Called frequently!
    // Called in every change detection cycle anywhere on the page
    ngDoCheck() { this.logIt(`Docheck`); }

    ngAfterContentInit() { this.logIt(`AfterContentInit`);  }

    // Beware! Called frequently!
    // Called in every change detection cycle anywhere on the page 
    ngAfterContentChecked () { this.logIt(`AfterContentChecked`); }

    ngAfterViewInit () { this.logIt(`AfterViewInit`); }

    // Beware! Called fequently!
    // Called in every change detection cycle anywhere on the page 
    ngAfterViewChecked() { this.logIt(`AfterViewChecked`); }

    ngOnDestroy() { this.logIt(`OnDestroy`); }
}
