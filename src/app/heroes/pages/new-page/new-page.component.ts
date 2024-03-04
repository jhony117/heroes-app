import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id:               new FormControl(''),
    superhero:        new FormControl('', {nonNullable:true}),
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),

  });

  public publishers = [
    { id : 'DC Comics', desc : 'DC - Comics'},
    { id : 'Marvel Comics', desc : 'Marvel - Comics'}
  ];

    constructor(
      private heroService:HeroesService,
      private activatedRoute: ActivatedRoute,
      private router:Router,
      private snackbar:MatSnackBar,
      private dialog: MatDialog,
      ) {}


  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroService.getHeroById(id)),
      ).subscribe(hero => {
        if(!hero ) return this.router.navigateByUrl('/')
            //? Investigas ams al respecto de heorFomr.reset
  this.heroForm.reset( hero );
      return;
      });



  }

  get currentHero(): Hero {
     const Hero = this.heroForm.value as Hero;
     return Hero;
  }

  onSubmit():void {

     if( this.heroForm.invalid) return;

     if( this.currentHero.id ){
      this.heroService.updateHero(this.currentHero)
       .subscribe(hero => {

        this.showSnackbar(`${hero.superhero} actualizado !`)
      });


       return;
     }


     this.heroService.addHero(this.currentHero)
         .subscribe(hero => {
              //TODO : mostrar snackbar  y navegar a /heroes/edit/ hero.id
              this.router.navigate(['/heroes/edit', hero.id]);
              this.showSnackbar(`${hero.superhero} creado ! `)
         });




  }

  onDeleteHero(){
    if (!this.currentHero.id) throw Error('El id es requerido');

    const dialogRef = this.dialog.open(ConfirmDialogComponent ,{
      data: this.heroForm.value
    });


  dialogRef.afterClosed()
  .pipe(   //*result => result === true
    filter((result:boolean) => result), //? deja pasar solo si es que es positivo
    switchMap(() => this.heroService.deleteHeroById(this.currentHero.id)),
    filter((wasDeleted:boolean) =>wasDeleted), //? deja pasar solo si fue eliminado
    )
  .subscribe(result => {
    this.router.navigate(['/heroes']);
  })



    // dialogRef.afterClosed().subscribe(result => {
    //     if(!result) return;

    //     this.heroService.deleteHeroById(this.currentHero.id)
    //     .subscribe(wasDeleted => {
    //         if(wasDeleted)
    //      this.router.navigate(['/heroes']);
    //     })


    // })

  }

  showSnackbar(message:string):void{
    this.snackbar.open(message, 'done ',{
   duration: 2500,
    })
  }

}
