<?php

declare(strict_types=1);

namespace Eekes\Sulu\AdminUxBundle;

use Eekes\Sulu\AdminUxBundle\Metadata\BlockGroupFormMetadataVisitor;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\HttpKernel\Bundle\AbstractBundle;

use function Symfony\Component\DependencyInjection\Loader\Configurator\service;

class EekesSuluAdminUxBundle extends AbstractBundle
{
    public function loadExtension(array $config, ContainerConfigurator $container, ContainerBuilder $builder): void
    {
        $container->services()
            ->set('eekes_sulu_admin_ux.block_group_form_metadata_visitor', BlockGroupFormMetadataVisitor::class)
            ->args([service('sulu_admin.metadata_provider_registry')])
            ->tag('sulu_admin.form_metadata_visitor')
            ->tag('sulu_admin.typed_form_metadata_visitor');
    }
}
