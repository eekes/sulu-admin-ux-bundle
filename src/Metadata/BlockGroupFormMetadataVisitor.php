<?php

declare(strict_types=1);

namespace Eekes\Sulu\AdminUxBundle\Metadata;

use Sulu\Bundle\AdminBundle\Metadata\FormMetadata\FieldMetadata;
use Sulu\Bundle\AdminBundle\Metadata\FormMetadata\FormMetadata;
use Sulu\Bundle\AdminBundle\Metadata\FormMetadata\FormMetadataVisitorInterface;
use Sulu\Bundle\AdminBundle\Metadata\FormMetadata\ItemMetadata;
use Sulu\Bundle\AdminBundle\Metadata\FormMetadata\SectionMetadata;
use Sulu\Bundle\AdminBundle\Metadata\FormMetadata\TypedFormMetadata;
use Sulu\Bundle\AdminBundle\Metadata\FormMetadata\TypedFormMetadataVisitorInterface;
use Sulu\Bundle\AdminBundle\Metadata\MetadataProviderRegistry;

/**
 * Gives every block type of a form the `<group>` of its block template. Sulu reads that group from the template but
 * copies only the title onto the block types of a form, so the admin's block dropdown (Resources/js/blockGroups)
 * could not sort them into groups.
 */
final class BlockGroupFormMetadataVisitor implements TypedFormMetadataVisitorInterface, FormMetadataVisitorInterface
{
    /** @var null|array<string, FormMetadata> */
    private ?array $blocks = null;

    public function __construct(
        private readonly MetadataProviderRegistry $metadataProviderRegistry,
    ) {
    }

    public function visitTypedFormMetadata(TypedFormMetadata $formMetadata, string $key, string $locale, array $metadataOptions = []): void
    {
        // The block templates themselves are loaded with this option, by Sulu and by blocks() below.
        if ($metadataOptions['ignore_global_blocks'] ?? false) {
            return;
        }

        foreach ($formMetadata->getForms() as $form) {
            $this->groupBlockTypes($form->getItems(), $locale);
        }
    }

    public function visitFormMetadata(FormMetadata $formMetadata, string $locale, array $metadataOptions = []): void
    {
        if ($metadataOptions['ignore_global_blocks'] ?? false) {
            return;
        }

        $this->groupBlockTypes($formMetadata->getItems(), $locale);
    }

    /**
     * @param ItemMetadata[] $items
     */
    private function groupBlockTypes(array $items, string $locale): void
    {
        foreach ($items as $item) {
            if ($item instanceof SectionMetadata) {
                $this->groupBlockTypes($item->getItems(), $locale);

                continue;
            }

            if (!$item instanceof FieldMetadata) {
                continue;
            }

            foreach ($item->getTypes() as $type) {
                $globalBlock = $type->getTagsByName('sulu.global_block')[0] ?? null;
                $block = $globalBlock ? ($this->blocks($locale)[(string) $globalBlock->getAttribute('global_block')] ?? null) : null;

                if (null !== $block && null === $type->getGroup()) {
                    $type->setGroup($block->getGroup());
                }

                $this->groupBlockTypes($type->getItems(), $locale);
            }
        }
    }

    /**
     * @return array<string, FormMetadata>
     */
    private function blocks(string $locale): array
    {
        if (null === $this->blocks) {
            $blocks = $this->metadataProviderRegistry->getMetadataProvider('form')
                ->getMetadata('block', $locale, ['ignore_global_blocks' => true]);

            $this->blocks = $blocks instanceof TypedFormMetadata ? $blocks->getForms() : [];
        }

        return $this->blocks;
    }
}
