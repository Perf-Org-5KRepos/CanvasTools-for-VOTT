import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";

import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";

import { TagsComponent } from "../Component/TagsComponent";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

/*
* TagsElement
* Used internally to draw labels and map colors for the region
*/
export class TagsElement extends TagsComponent {
    public static DEFAULT_PRIMARY_TAG_RADIUS: number = 3;
    public static DEFAULT_SECONDARY_TAG_SIZE: number = 6;
    public static DEFAULT_SECONDARY_TAG_DY: number = 6;

    // Elements
    private primaryTagBoundRect: Snap.Element;
    private primaryTagPolygon: Snap.Element;

    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, tags: TagsDescriptor,
                styleId: string, styleSheet: CSSStyleSheet, tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions);

        this.buildOn(paper, tags);
    }

    public redraw() {
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });

        const size = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
        const cx = this.x + this.width / 2;
        const cy = this.y - size - 5;

        window.requestAnimationFrame(() => {
            this.primaryTagBoundRect.attr({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            });

            this.primaryTagPolygon.attr({
                points: pointsData.toString(),
            });

            // Secondary Tags
            if (this.secondaryTags && this.secondaryTags.length > 0) {
                const length = this.secondaryTags.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.secondaryTags[i];
                    const x = cx + (2 * i - length + 0.5) * size;

                    stag.attr({
                        x,
                        y: cy,
                    });
                }
            }
        });
    }

    protected initStyleMaps(tags: TagsDescriptor) {
        if (tags !== null) {
            if (tags.primary !== null) {
                this.styleMap = [
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorDark};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorAccent};
                                stroke: ${tags.primary.colorDark};`,
                    },
                    {
                        rule: `.${this.styleId}:hover .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.${this.styleId}:hover .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke:${tags.primary.colorDark};
                                fill: ${tags.primary.colorPure}`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                        style: `stroke:#fff;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill:transparent;`,
                    },
                ];

                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: none;
                                stroke: ${tags.primary.colorDark};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `stroke: ${tags.primary.colorShadow};`,
                    },
                    {
                        rule: `.${this.styleId}:hover .primaryTagBoundRectStyle`,
                        style: `fill: none;
                                stroke: ${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: none;
                                stroke: ${tags.primary.colorPure};
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.${this.styleId}:hover .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke:${tags.primary.colorDark};
                                fill: ${tags.primary.colorPure}`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                        style: `stroke:#fff;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill:transparent;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                        style: `opacity:0.25;`,
                    },
                ];
            } else {
                this.styleMap = [];
                this.styleLightMap = [];
            }

            if (tags.secondary !== null && tags.secondary !== undefined) {
                tags.secondary.forEach((tag) => {
                    const rule = {
                        rule: `.secondaryTagStyle.secondaryTag-${tag.name}`,
                        style: `fill: ${tag.colorAccent};`,
                    };

                    this.styleMap.push(rule);
                    this.styleLightMap.push(rule);
                });
            }
        }
    }

    protected rebuildTagLabels() {
        // Clear secondary tags -> redraw from scratch
        for (const tag of this.secondaryTags) {
            tag.remove();
        }
        this.secondaryTags = [];
        // If there are tags assigned
        if (this.tags) {
            if (this.tags.primary !== undefined && this.tags.primary !== null) {
                // Primary Tag

            }
            // Secondary Tags
            if (this.tags.secondary && this.tags.secondary.length > 0) {
                const length = this.tags.secondary.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.tags.secondary[i];

                    const s = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
                    const x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * s - s / 2;
                    const y = this.y - s - 5;
                    const tagel = this.paper.rect(x, y, s, s);

                    window.requestAnimationFrame(() => {
                        tagel.addClass("secondaryTagStyle");
                        tagel.addClass(`secondaryTag-${stag.name}`);
                    });

                    this.secondaryTagsNode.add(tagel);
                    this.secondaryTags.push(tagel);
                }
            }
        }
    }

    private buildOn(paper: Snap.Paper, tags: TagsDescriptor) {
        this.primaryTagNode = paper.g();

        this.primaryTagBoundRect = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
        this.primaryTagBoundRect.addClass("primaryTagBoundRectStyle");

        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagPolygon = paper.polygon(pointsData);
        this.primaryTagPolygon.addClass("primaryTagPolygonStyle");

        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });

        this.primaryTagNode.add(this.primaryTagBoundRect);
        this.primaryTagNode.add(this.primaryTagPolygon);

        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondatyTagsLayer");
        this.secondaryTags = [];

        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);

        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}