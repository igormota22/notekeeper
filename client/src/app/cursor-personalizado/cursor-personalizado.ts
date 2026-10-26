
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    PLATFORM_ID,
    inject,
    signal,
    viewChild
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
    selector: 'app-cursor-personalizado',
    standalone: true,
    imports: [],
    templateUrl: './cursor-personalizado.html',
    styleUrl: './cursor-personalizado.css'
})
export class CursorPersonalizado implements AfterViewInit, OnDestroy {
    private readonly platformId = inject(PLATFORM_ID);

    private readonly elementoRef =
        viewChild<ElementRef<HTMLElement>>('cursor');

    protected readonly ativo = signal(false);

    private mediaQuery?: MediaQueryList;

    private readonly moverMouse = (evento: MouseEvent): void => {
        const elemento = this.elementoRef()?.nativeElement;

        if (!elemento || !this.ativo()) {
            return;
        }

        gsap.to(elemento, {
            x: evento.clientX,
            y: evento.clientY,
            opacity: 1,
            duration: 0.06,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    };

    private readonly clicarMouse = (): void => {
        const elemento = this.elementoRef()?.nativeElement;

        if (!elemento || !this.ativo()) {
            return;
        }

        gsap.fromTo(
            elemento,
            {
                scale: 0.85,
                rotate: -12
            },
            {
                scale: 1,
                rotate: 0,
                duration: 0.28,
                ease: 'back.out(2)',
                overwrite: 'auto'
            }
        );
    };

    private readonly atualizarInteracao = (
        evento: MouseEvent
    ): void => {
        const elemento = this.elementoRef()?.nativeElement;
        const alvo = evento.target;

        if (!elemento || !(alvo instanceof Element)) {
            return;
        }

        const interativo = alvo.closest(
            'a, button, [role="button"], select, ' +
            '[tabindex]:not([tabindex="-1"]), label, summary'
        );

        elemento.classList.toggle(
            'cursor-interativo',
            !!interativo
        );
    };

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.mediaQuery = window.matchMedia(
            '(hover: hover) and (pointer: fine) and ' +
            '(prefers-reduced-motion: no-preference)'
        );

        this.configurarCursor();

        this.mediaQuery.addEventListener(
            'change',
            this.configurarCursor
        );
    }

    private configurarCursor = (): void => {
        this.removerEventos();

        const elemento = this.elementoRef()?.nativeElement;

        if (!elemento || !this.mediaQuery) {
            return;
        }

        this.ativo.set(this.mediaQuery.matches);

        if (!this.ativo()) {
            gsap.set(elemento, {
                opacity: 0,
                x: -100,
                y: -100
            });

            return;
        }

        gsap.set(elemento, {
            x: -100,
            y: -100,
            opacity: 0,
            scale: 1,
            rotate: 0
        });

        document.addEventListener(
            'mousemove',
            this.moverMouse
        );

        document.addEventListener(
            'mousemove',
            this.atualizarInteracao
        );

        document.addEventListener(
            'mousedown',
            this.clicarMouse
        );
    };

    private removerEventos(): void {
        document.removeEventListener(
            'mousemove',
            this.moverMouse
        );

        document.removeEventListener(
            'mousemove',
            this.atualizarInteracao
        );

        document.removeEventListener(
            'mousedown',
            this.clicarMouse
        );

        const elemento = this.elementoRef()?.nativeElement;

        if (elemento) {
            gsap.killTweensOf(elemento);

            elemento.classList.remove(
                'cursor-interativo'
            );
        }
    }

    ngOnDestroy(): void {
        this.removerEventos();

        this.mediaQuery?.removeEventListener(
            'change',
            this.configurarCursor
        );
    }
}
